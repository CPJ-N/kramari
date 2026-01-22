import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { LiveKitService } from './livekit.service'

interface CreateTestSessionDto {
  participantName?: string
}

interface TestSessionResponse {
  roomName: string
  token: string
  livekitUrl: string
}

@ApiTags('voice')
@Controller('voice')
export class VoiceController {
  constructor(
    private readonly livekitService: LiveKitService,
    private readonly configService: ConfigService,
  ) {}

  @Post('test-session')
  @ApiOperation({ summary: 'Create a test voice session with the Kramari agent' })
  @ApiResponse({ status: 201, description: 'Test session created successfully' })
  @ApiResponse({ status: 503, description: 'LiveKit not configured' })
  async createTestSession(
    @Body() dto: CreateTestSessionDto
  ): Promise<TestSessionResponse> {
    const livekitUrl = this.configService.get<string>('app.livekit.url')

    if (!livekitUrl) {
      throw new HttpException(
        'LiveKit is not configured. Please set LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET.',
        HttpStatus.SERVICE_UNAVAILABLE
      )
    }

    const participantName = dto.participantName || `user-${Date.now()}`

    // Create a room for the test session
    const room = await this.livekitService.createRoom('test-agent', {
      emptyTimeout: 300,
      maxParticipants: 2,
    })

    // Generate a token for the participant
    const token = await this.livekitService.generateToken(
      room.name,
      participantName,
      { ttl: '1h' }
    )

    return {
      roomName: room.name,
      token,
      livekitUrl,
    }
  }

  @Get('rooms')
  @ApiOperation({ summary: 'List all active voice rooms' })
  async listRooms() {
    return this.livekitService.listRooms()
  }

  @Get('rooms/:roomName/participants')
  @ApiOperation({ summary: 'List participants in a room' })
  async listParticipants(@Param('roomName') roomName: string) {
    return this.livekitService.listParticipants(roomName)
  }
}
