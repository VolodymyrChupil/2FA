import { Controller, Get } from "@nestjs/common"
import { AppService } from "./app.service"

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus(): string {
    return this.appService.getStatus()
  }

  @Get("protected")
  getProtectedRoute(): string {
    return this.appService.protectedRoute()
  }
}
