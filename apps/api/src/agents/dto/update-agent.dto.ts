import { PartialType } from '@nestjs/swagger'
import { CreateAgentDto } from './create-agent.dto'
import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateAgentDto extends PartialType(CreateAgentDto) {
  @ApiProperty({
    description: 'Agent status',
    enum: ['draft', 'testing', 'live', 'paused', 'archived'],
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string
}