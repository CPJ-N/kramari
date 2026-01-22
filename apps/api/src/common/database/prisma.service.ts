import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('app.database.url'),
        },
      },
      log: ['error', 'warn'],
    })
  }

  async onModuleInit() {
    try {
      await this.$connect()
      console.log('✅ Database connected successfully')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      throw error
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  // Helper methods for transactions
  async executeTransaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return await this.$transaction(fn)
  }

  // Clean up old data
  async cleanupOldRecords() {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Clean up old calls
    const deletedCalls = await this.call.deleteMany({
      where: {
        endedAt: {
          lt: thirtyDaysAgo,
        },
      },
    })

    console.log(`Cleaned up ${deletedCalls.count} old call records`)
  }
}