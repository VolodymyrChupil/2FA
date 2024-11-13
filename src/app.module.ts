import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./auth/auth.module"
import { ConfigModule } from "@nestjs/config"
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { APP_GUARD } from "@nestjs/core"
import { RegisterModule } from "./register/register.module"
import { MailerModule } from "@nestjs-modules/mailer"
import { MailModule } from "./mail/mail.module"
import { JwtModule } from "@nestjs/jwt"
import { LoggerMiddleware } from "./logger/logger.middleware"
import { LoggerModule } from "./logger/logger.module"

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 50 }]),
    RegisterModule,
    MailerModule.forRoot({
      transport: process.env.EMAIL_TRANSPORT,
    }),
    MailModule,
    JwtModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL })
  }
}
