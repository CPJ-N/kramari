import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RoomServiceClient, AccessToken } from 'livekit-server-sdk'

@Injectable()
export class LiveKitService {
  private roomService: RoomServiceClient

  constructor(private configService: ConfigService) {
    const url = this.configService.get('app.livekit.url')
    const apiKey = this.configService.get('app.livekit.apiKey')
    const apiSecret = this.configService.get('app.livekit.apiSecret')

    if (url && apiKey && apiSecret) {
      this.roomService = new RoomServiceClient(url, apiKey, apiSecret)
      console.log('✅ LiveKit service initialized')
    } else {
      console.warn('⚠️ LiveKit credentials not configured')
    }
  }

  async createRoom(agentId: string, options?: any) {
    const roomName = `agent-${agentId}-${Date.now()}`

    if (!this.roomService) {
      console.warn('LiveKit not configured, returning mock room')
      return { name: roomName, sid: 'mock-sid' }
    }

    try {
      const room = await this.roomService.createRoom({
        name: roomName,
        emptyTimeout: options?.emptyTimeout || 300, // 5 minutes
        maxParticipants: options?.maxParticipants || 10,
        metadata: JSON.stringify({
          agentId,
          createdAt: new Date().toISOString(),
        }),
      })

      console.log(`✅ Created LiveKit room: ${roomName}`)
      return room
    } catch (error) {
      console.error('Failed to create LiveKit room:', error)
      throw error
    }
  }

  async generateToken(
    roomName: string,
    participantName: string,
    options?: any
  ): Promise<string> {
    const apiKey = this.configService.get('app.livekit.apiKey')
    const apiSecret = this.configService.get('app.livekit.apiSecret')

    if (!apiKey || !apiSecret) {
      console.warn('LiveKit not configured, returning mock token')
      return 'mock-token-' + Date.now()
    }

    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      ttl: options?.ttl || '10h',
    })

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    })

    return token.toJwt()
  }

  async deleteRoom(roomName: string) {
    if (!this.roomService) {
      console.warn('LiveKit not configured, skipping room deletion')
      return
    }

    try {
      await this.roomService.deleteRoom(roomName)
      console.log(`✅ Deleted LiveKit room: ${roomName}`)
    } catch (error) {
      console.error('Failed to delete LiveKit room:', error)
    }
  }

  async listRooms() {
    if (!this.roomService) {
      return []
    }

    try {
      const rooms = await this.roomService.listRooms()
      return rooms
    } catch (error) {
      console.error('Failed to list LiveKit rooms:', error)
      return []
    }
  }

  async getRoom(roomName: string) {
    if (!this.roomService) {
      return null
    }

    try {
      const rooms = await this.roomService.listRooms([roomName])
      return rooms[0] || null
    } catch (error) {
      console.error('Failed to get LiveKit room:', error)
      return null
    }
  }

  async listParticipants(roomName: string) {
    if (!this.roomService) {
      return []
    }

    try {
      const participants = await this.roomService.listParticipants(roomName)
      return participants
    } catch (error) {
      console.error('Failed to list participants:', error)
      return []
    }
  }

  async removeParticipant(roomName: string, identity: string) {
    if (!this.roomService) {
      return
    }

    try {
      await this.roomService.removeParticipant(roomName, identity)
      console.log(`✅ Removed participant ${identity} from room ${roomName}`)
    } catch (error) {
      console.error('Failed to remove participant:', error)
    }
  }

  async muteParticipant(
    roomName: string,
    identity: string,
    trackSid: string,
    muted: boolean
  ) {
    if (!this.roomService) {
      return
    }

    try {
      await this.roomService.mutePublishedTrack(roomName, identity, trackSid, muted)
      console.log(`✅ ${muted ? 'Muted' : 'Unmuted'} participant ${identity}`)
    } catch (error) {
      console.error('Failed to mute/unmute participant:', error)
    }
  }
}