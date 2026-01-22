import { Module } from '@nestjs/common'
import { AgentsController } from './agents.controller'
import { AgentsService } from './agents.service'
import { VoiceModule } from '../voice/voice.module'
import { TelephonyModule } from '../telephony/telephony.module'
import { OrchestrationModule } from '../orchestration/orchestration.module'

@Module({
  imports: [VoiceModule, TelephonyModule, OrchestrationModule],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}