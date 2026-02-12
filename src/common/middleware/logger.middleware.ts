import { Injectable, NestMiddleware } from "@nestjs/common"
import { NextFunction, Request, Response } from "express"
import * as morgan from "morgan"
import * as fs from "fs"
import * as fsP from "fs/promises"
import * as path from "path"
import { format } from "date-fns"

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.toLocaleString("en", { month: "long" })

    const dirPath = path.join(process.cwd(), "logs", `${year}`, `${month}`)
    if (!fs.existsSync(dirPath)) {
      await fsP.mkdir(dirPath, { recursive: true })
    }

    const fileName = `${format(date, "dd-MM-yyyy")}.log`
    const logStream = fs.createWriteStream(path.join(dirPath, fileName), {
      flags: "a",
    })

    morgan(`[:date] :remote-addr :method :url :status :user-agent `, {
      stream: logStream,
    })(req, res, () => {})

    next()
  }
}
