import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      environment: this.configService.get('NODE_ENV') || 'development',
    }
  }

  getStatus() {
    return {
      api: 'operational',
      database: 'connected',
      redis: 'connected',
      livekit: 'connected',
      twilio: 'connected',
      claude: 'connected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    }
  }
}