import { Injectable } from "@nestjs/common"

@Injectable()
export class AppService {
  privateRoute(): string {
    return "If u are reading this that mean u are authorized"
  }
}
