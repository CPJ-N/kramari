import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Anthropic from '@anthropic-ai/sdk'
import { PrismaService } from '../common/database/prisma.service'
import { LiveKitService } from '../voice/livekit.service'
import { TwilioService } from '../telephony/twilio.service'
import { OrchestrationService } from '../orchestration/orchestration.service'
import { CreateAgentDto } from './dto/create-agent.dto'
import { UpdateAgentDto } from './dto/update-agent.dto'
import { GenerateConfigDto, EnhancePromptDto, VoicePreviewDto } from './dto/generate-config.dto'

@Injectable()
export class AgentsService {
  private anthropic: Anthropic

  constructor(
    private prisma: PrismaService,
    private livekit: LiveKitService,
    private twilio: TwilioService,
    private orchestration: OrchestrationService,
    private configService: ConfigService,
  ) {
    this.anthropic = new Anthropic({
      apiKey: this.configService.get('ANTHROPIC_API_KEY'),
    })
  }

  async quickDeploy(templateId: string) {
    console.log(`🚀 Quick deploying agent from template: ${templateId}`)

    // 1. Get or create default template
    let template = await this.prisma.agentTemplate.findFirst({
      where: { category: templateId },
    })

    if (!template) {
      // Create a default template if it doesn't exist
      template = await this.createDefaultTemplate(templateId)
    }

    // 2. Create agent from template
    const agent = await this.prisma.agent.create({
      data: {
        name: `${template.name} Agent`,
        type: template.category,
        systemPrompt: (template.prompts as any).system || 'You are a helpful assistant.',
        voice: (template.config as any).voice || 'alloy',
        voiceProvider: (template.config as any).voiceProvider || 'elevenlabs',
        status: 'testing',
        config: template.config,
        organizationId: 'default-org', // TODO: Get from auth context
      },
    })

    // 3. Create LiveKit room
    const room = await this.livekit.createRoom(agent.id)

    // 4. Provision phone number (mock for now)
    const phoneNumber = await this.twilio.provisionNumber()

    // 5. Create phone number record
    const phone = await this.prisma.phoneNumber.create({
      data: {
        number: phoneNumber,
        provider: 'twilio',
        type: 'local',
        country: 'US',
        organizationId: 'default-org',
      },
    })

    // 6. Link phone to agent
    await this.prisma.agentPhoneNumber.create({
      data: {
        agentId: agent.id,
        phoneNumberId: phone.id,
        priority: 0,
        isActive: true,
      },
    })

    // 7. Update agent status to live
    const updatedAgent = await this.prisma.agent.update({
      where: { id: agent.id },
      data: {
        status: 'live',
        lastActiveAt: new Date(),
      },
    })

    // 8. Deploy agent instance
    await this.orchestration.deployAgent(agent.id)

    // 9. Update template deploy count
    await this.prisma.agentTemplate.update({
      where: { id: template.id },
      data: {
        deployCount: { increment: 1 },
      },
    })

    return {
      agentId: agent.id,
      phoneNumber: phoneNumber,
      webUrl: `${this.configService.get('app.frontendUrl')}/call/${room.name}`,
      roomName: room.name,
      status: 'live',
      message: 'Agent deployed successfully!',
    }
  }

  async create(createAgentDto: CreateAgentDto) {
    return this.prisma.agent.create({
      data: {
        ...createAgentDto,
        organizationId: 'default-org', // TODO: Get from auth context
      },
    })
  }

  async findAll(params: {
    status?: string
    type?: string
    limit: number
    offset: number
  }) {
    const where: any = {}

    if (params.status) {
      where.status = params.status
    }
    if (params.type) {
      where.type = params.type
    }

    const [agents, total] = await Promise.all([
      this.prisma.agent.findMany({
        where,
        take: params.limit,
        skip: params.offset,
        include: {
          phoneNumbers: {
            include: {
              phoneNumber: true,
            },
          },
          _count: {
            select: {
              calls: true,
              instances: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.agent.count({ where }),
    ])

    return {
      data: agents,
      total,
      limit: params.limit,
      offset: params.offset,
    }
  }

  async findOne(id: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { id },
      include: {
        phoneNumbers: {
          include: {
            phoneNumber: true,
          },
        },
        instances: true,
        _count: {
          select: {
            calls: true,
          },
        },
      },
    })

    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`)
    }

    return agent
  }

  async update(id: string, updateAgentDto: UpdateAgentDto) {
    const agent = await this.findOne(id)

    return this.prisma.agent.update({
      where: { id },
      data: updateAgentDto,
    })
  }

  async remove(id: string) {
    const agent = await this.findOne(id)

    // Clean up resources
    if (agent.status === 'live') {
      await this.pause(id)
    }

    // Remove phone number associations
    await this.prisma.agentPhoneNumber.deleteMany({
      where: { agentId: id },
    })

    // Delete agent
    return this.prisma.agent.delete({
      where: { id },
    })
  }

  async deploy(id: string) {
    const agent = await this.findOne(id)

    if (agent.status === 'live') {
      throw new BadRequestException('Agent is already deployed')
    }

    // Deploy agent instance
    await this.orchestration.deployAgent(id)

    return this.prisma.agent.update({
      where: { id },
      data: {
        status: 'live',
        lastActiveAt: new Date(),
      },
    })
  }

  async pause(id: string) {
    const agent = await this.findOne(id)

    if (agent.status !== 'live') {
      throw new BadRequestException('Agent is not currently live')
    }

    // Stop agent instances
    await this.orchestration.pauseAgent(id)

    return this.prisma.agent.update({
      where: { id },
      data: {
        status: 'paused',
      },
    })
  }

  async resume(id: string) {
    const agent = await this.findOne(id)

    if (agent.status !== 'paused') {
      throw new BadRequestException('Agent is not currently paused')
    }

    // Resume agent instances
    await this.orchestration.resumeAgent(id)

    return this.prisma.agent.update({
      where: { id },
      data: {
        status: 'live',
        lastActiveAt: new Date(),
      },
    })
  }

  async scale(id: string, instances: number) {
    const agent = await this.findOne(id)

    if (instances < 0 || instances > 100) {
      throw new BadRequestException('Instance count must be between 0 and 100')
    }

    // Scale agent instances
    await this.orchestration.scaleAgent(id, instances)

    return {
      agentId: id,
      instances,
      status: 'scaling',
    }
  }

  async getMetrics(id: string, period?: string) {
    const agent = await this.findOne(id)

    const metrics = await this.prisma.agentMetrics.findMany({
      where: {
        agentId: id,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 24, // Last 24 data points
    })

    return metrics
  }

  async getInstances(id: string) {
    const agent = await this.findOne(id)

    return this.prisma.agentInstance.findMany({
      where: {
        agentId: id,
      },
      orderBy: {
        startedAt: 'desc',
      },
    })
  }

  async generateConfig(dto: GenerateConfigDto) {
    const isChat = dto.chatHistory && dto.chatHistory.length > 0

    const systemPrompt = `You are an AI assistant that helps configure voice agents. Given a user's description, generate a complete agent configuration as JSON.

Available voice providers: "elevenlabs", "openai"
Available ElevenLabs voices: "rachel", "drew", "clyde", "domi", "bella", "antoni", "elli", "josh"
Available OpenAI voices: "alloy", "echo", "fable", "onyx", "nova", "shimmer"
Available models: "claude-3-sonnet", "claude-3-opus", "claude-3-haiku", "gpt-4o", "gpt-4o-mini"
Available tools: "get_current_time", "get_weather", "transfer_call", "check_calendar", "lookup_customer", "send_sms", "create_ticket", "book_appointment"
Available languages: "en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh", "hi", "ar"

${isChat ? `You are in guided conversation mode. Ask follow-up questions to gather more details about the agent before generating config. Only generate the full config when you have enough information.

If you need more info, respond with JSON: {"followUp": "your question here"}
When ready to generate, respond with JSON: {"config": {...}, "followUp": "I've configured your agent..."}` : `Generate the complete config immediately based on the description.`}

Always respond with valid JSON. For the config object, include: name, description, type (one of: customer-service, sales, support, appointment-setter, custom), personality, firstMessage, voice, voiceProvider, language, systemPrompt, model, temperature (0-1), tools (array of {id, name} for relevant tools).`

    const messages: any[] = isChat
      ? dto.chatHistory.map(m => ({ role: m.role, content: m.content }))
      : [{ role: 'user' as const, content: dto.description }]

    const response = await this.anthropic.messages.create({
      model: this.configService.get('CLAUDE_MODEL') || 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages,
    })

    const text = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')

    try {
      const parsed = JSON.parse(text)
      return parsed.config ? parsed : { config: parsed }
    } catch {
      return { config: { name: 'My Agent', description: dto.description, type: 'custom', systemPrompt: text } }
    }
  }

  async enhancePrompt(dto: EnhancePromptDto) {
    const response = await this.anthropic.messages.create({
      model: this.configService.get('CLAUDE_MODEL') || 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: `You are an expert at writing system prompts for voice AI agents. Enhance the given prompt to be more detailed, effective, and production-ready. Keep the same intent but add:
- Clear role definition
- Specific behavioral guidelines
- Edge case handling
- Tone and style instructions
- Call flow guidance

${dto.agentName ? `Agent name: ${dto.agentName}` : ''}
${dto.personality ? `Personality: ${dto.personality}` : ''}
${dto.type ? `Type: ${dto.type}` : ''}

Return ONLY the enhanced prompt text, no JSON wrapping or explanation.`,
      messages: [{ role: 'user', content: dto.prompt }],
    })

    const enhancedPrompt = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')

    return { enhancedPrompt }
  }

  async getVoicePreview(dto: VoicePreviewDto): Promise<Buffer> {
    const text = dto.text || 'Hi there! Thanks for calling. How can I help you today?'

    if (dto.provider === 'elevenlabs') {
      const apiKey = this.configService.get('ELEVENLABS_API_KEY')
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${dto.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        }
      )

      if (!response.ok) {
        throw new BadRequestException('Failed to generate voice preview')
      }

      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    }

    if (dto.provider === 'openai') {
      const apiKey = this.configService.get('OPENAI_API_KEY')
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: dto.voiceId,
          response_format: 'mp3',
        }),
      })

      if (!response.ok) {
        throw new BadRequestException('Failed to generate voice preview')
      }

      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    }

    throw new BadRequestException(`Unsupported voice provider: ${dto.provider}`)
  }

  private async createDefaultTemplate(category: string) {
    const templates = {
      'customer-service': {
        name: 'Customer Service',
        description: 'Handle support inquiries 24/7',
        prompts: {
          system: `You are a helpful customer service agent. Be polite, professional, and aim to resolve customer issues efficiently.
          Listen carefully to customer concerns and provide clear, helpful responses.
          If you cannot resolve an issue, offer to escalate to a human agent.`,
          examples: [],
        },
        config: {
          voice: 'alloy',
          voiceProvider: 'elevenlabs',
          maxDuration: 1800,
          interruptionThreshold: 0.5,
        },
      },
      'sales-qualifier': {
        name: 'Sales Qualifier',
        description: 'Qualify leads automatically',
        prompts: {
          system: `You are a professional sales representative. Your goal is to qualify leads by understanding their needs,
          budget, timeline, and decision-making process. Be friendly but professional.
          Ask relevant questions to determine if they are a good fit for our services.`,
          examples: [],
        },
        config: {
          voice: 'nova',
          voiceProvider: 'elevenlabs',
          maxDuration: 900,
        },
      },
      'appointment-setter': {
        name: 'Appointment Setter',
        description: 'Book meetings effortlessly',
        prompts: {
          system: `You are an appointment scheduling assistant. Help callers book appointments at convenient times.
          Check availability, confirm details, and ensure all necessary information is collected.
          Be efficient and courteous.`,
          examples: [],
        },
        config: {
          voice: 'echo',
          voiceProvider: 'elevenlabs',
          maxDuration: 600,
        },
      },
    }

    const template = templates[category] || templates['customer-service']

    return this.prisma.agentTemplate.create({
      data: {
        name: template.name,
        description: template.description,
        category,
        prompts: template.prompts,
        config: template.config,
        isPublic: true,
        popular: true,
      },
    })
  }
}