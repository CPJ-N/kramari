import { IsString, IsOptional, IsObject, IsNumber, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateAgentDto {
  @ApiProperty({ description: 'Agent name' })
  @IsString()
  name: string

  @ApiProperty({ description: 'Agent description', required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'Agent type',
    enum: ['customer-service', 'sales', 'support', 'appointment-setter', 'custom'],
  })
  @IsString()
  type: string

  @ApiProperty({ description: 'System prompt for the agent' })
  @IsString()
  systemPrompt: string

  @ApiProperty({ description: 'First message the agent says', required: false })
  @IsString()
  @IsOptional()
  firstMessage?: string

  @ApiProperty({ description: 'Voice model', default: 'alloy' })
  @IsString()
  @IsOptional()
  voice?: string

  @ApiProperty({ description: 'Voice provider', default: 'elevenlabs' })
  @IsString()
  @IsOptional()
  voiceProvider?: string

  @ApiProperty({ description: 'LLM model', default: 'claude-3-sonnet' })
  @IsString()
  @IsOptional()
  model?: string

  @ApiProperty({ description: 'Maximum concurrent calls', default: 10 })
  @IsNumber()
  @IsOptional()
  maxConcurrentCalls?: number

  @ApiProperty({ description: 'Maximum call duration in seconds', default: 1800 })
  @IsNumber()
  @IsOptional()
  maxCallDuration?: number

  @ApiProperty({ description: 'Additional configuration', required: false })
  @IsObject()
  @IsOptional()
  config?: any
}