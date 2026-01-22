import { Module } from '@nestjs/common'
import { LiveKitService } from './livekit.service'
import { VoiceController } from './voice.controller'

@Module({
  controllers: [VoiceController],
  providers: [LiveKitService],
  exports: [LiveKitService],
})
export class VoiceModule {}