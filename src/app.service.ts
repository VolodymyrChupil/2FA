import { Injectable } from "@nestjs/common"

@Injectable()
export class AppService {
  getStatus(): string {
    return `Server is healthy ${new Date()}`
  }

  protectedRoute(): string {
    return `This is a protected route`
  }
}
