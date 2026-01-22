import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  )

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Kramari API')
    .setDescription('Voice Agent Orchestration Platform API')
    .setVersion('0.1.0')
    .addTag('agents', 'Agent management endpoints')
    .addTag('calls', 'Call management endpoints')
    .addTag('voice', 'Voice and LiveKit endpoints')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const port = process.env.PORT || 3001
  await app.listen(port)

  console.log(`
  🚀 Kramari API is running!
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  📡 Port: ${port}
  📚 API Docs: http://localhost:${port}/api
  `)
}

bootstrap()