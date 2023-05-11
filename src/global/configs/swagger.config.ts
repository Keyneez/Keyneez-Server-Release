import { DocumentBuilder } from '@nestjs/swagger';

export const appVersion = '1.0';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Keyneez API Docs')
  .setDescription('The Keyneez page API description')
  .setVersion(appVersion)
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  })
  .build();
