import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

const PORT = process.env.PORT || 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle("2FA")
    .setDescription("The 2FA API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)

  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}
bootstrap().catch((err) => {
  console.error("Error starting server:", err)
})
