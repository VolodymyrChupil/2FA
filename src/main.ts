import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"
import { connectDb } from "./database/connectDb"
import mongoose from "mongoose"

const PORT = process.env.PORT
connectDb()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.use(cookieParser())
  await app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`)
  })
}

mongoose.connection.once("open", bootstrap)
mongoose.connection.on("error", () => {
  console.error("Connection failed")
})
