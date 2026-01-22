import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class QuickDeployDto {
  @ApiProperty({
    description: 'Template ID to deploy from',
    example: 'customer-service',
  })
  @IsString()
  templateId: string
}