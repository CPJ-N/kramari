import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Response } from 'express'
import { AgentsService } from './agents.service'
import { CreateAgentDto } from './dto/create-agent.dto'
import { UpdateAgentDto } from './dto/update-agent.dto'
import { QuickDeployDto } from './dto/quick-deploy.dto'
import { GenerateConfigDto, EnhancePromptDto, VoicePreviewDto } from './dto/generate-config.dto'

@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post('quick-deploy')
  @ApiOperation({ summary: 'Quick deploy an agent from template' })
  async quickDeploy(@Body() dto: QuickDeployDto) {
    return this.agentsService.quickDeploy(dto.templateId)
  }

  @Post('ai/generate-config')
  @ApiOperation({ summary: 'Generate agent config from natural language description' })
  async generateConfig(@Body() dto: GenerateConfigDto) {
    return this.agentsService.generateConfig(dto)
  }

  @Post('ai/enhance-prompt')
  @ApiOperation({ summary: 'Enhance a system prompt using AI' })
  async enhancePrompt(@Body() dto: EnhancePromptDto) {
    return this.agentsService.enhancePrompt(dto)
  }

  @Post('ai/voice-preview')
  @ApiOperation({ summary: 'Get a voice preview audio sample' })
  async voicePreview(@Body() dto: VoicePreviewDto, @Res() res: Response) {
    const audioBuffer = await this.agentsService.getVoicePreview(dto)
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
    })
    res.send(audioBuffer)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new agent' })
  create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentsService.create(createAgentDto)
  }

  @Get()
  @ApiOperation({ summary: 'Get all agents' })
  findAll(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.agentsService.findAll({
      status,
      type,
      limit: limit ? Number(limit) : 20,
      offset: offset ? Number(offset) : 0,
    })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent by ID' })
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id)
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an agent' })
  update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
    return this.agentsService.update(id, updateAgentDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an agent' })
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id)
  }

  @Post(':id/deploy')
  @ApiOperation({ summary: 'Deploy an agent' })
  deploy(@Param('id') id: string) {
    return this.agentsService.deploy(id)
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause an agent' })
  pause(@Param('id') id: string) {
    return this.agentsService.pause(id)
  }

  @Post(':id/resume')
  @ApiOperation({ summary: 'Resume a paused agent' })
  resume(@Param('id') id: string) {
    return this.agentsService.resume(id)
  }

  @Post(':id/scale')
  @ApiOperation({ summary: 'Scale agent instances' })
  scale(@Param('id') id: string, @Body() body: { instances: number }) {
    return this.agentsService.scale(id, body.instances)
  }

  @Get(':id/metrics')
  @ApiOperation({ summary: 'Get agent metrics' })
  getMetrics(@Param('id') id: string, @Query('period') period?: string) {
    return this.agentsService.getMetrics(id, period)
  }

  @Get(':id/instances')
  @ApiOperation({ summary: 'Get agent instances' })
  getInstances(@Param('id') id: string) {
    return this.agentsService.getInstances(id)
  }
}