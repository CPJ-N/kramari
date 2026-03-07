import { IsString, IsOptional, IsArray, IsIn } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GenerateConfigDto {
  @ApiProperty({ description: 'Natural language description of the desired agent' })
  @IsString()
  description: string

  @ApiProperty({ description: 'Chat history for guided mode', required: false })
  @IsArray()
  @IsOptional()
  chatHistory?: { role: string; content: string }[]
}

export class EnhancePromptDto {
  @ApiProperty({ description: 'The system prompt to enhance' })
  @IsString()
  prompt: string

  @ApiProperty({ description: 'Agent name for context', required: false })
  @IsString()
  @IsOptional()
  agentName?: string

  @ApiProperty({ description: 'Agent personality for context', required: false })
  @IsString()
  @IsOptional()
  personality?: string

  @ApiProperty({ description: 'Agent type for context', required: false })
  @IsString()
  @IsOptional()
  type?: string
}

export class VoicePreviewDto {
  @ApiProperty({ description: 'Voice ID to preview' })
  @IsString()
  voiceId: string

  @ApiProperty({ description: 'Voice provider (elevenlabs or openai)', enum: ['elevenlabs', 'openai'] })
  @IsIn(['elevenlabs', 'openai'])
  provider: 'elevenlabs' | 'openai'

  @ApiProperty({ description: 'Sample text to speak', required: false })
  @IsString()
  @IsOptional()
  text?: string
}
