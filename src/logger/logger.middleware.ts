import { Injectable, NestMiddleware } from "@nestjs/common"
import * as morgan from "morgan"
import * as fs from "fs"
import * as path from "path"
import * as fsP from "fs/promises"
import { NextFunction } from "express"
import { format } from "date-fns"

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const dirPath = path.join(process.cwd(), "logs")
    if (!fs.existsSync(dirPath)) {
      fsP.mkdir(dirPath)
    }

    const day = `${format(new Date(), "dd-MM-yyyy")}`
    const logStream = fs.createWriteStream(path.join(dirPath, `${day}.log`), {
      flags: "a",
    })

    morgan.token("custom-date", () => {
      const date = `[${format(new Date(), "dd/MM/yyyy HH:mm:ss")}]`
      return `${date}`
    })

    morgan(`:remote-addr -- :custom-date :method  :url  :status  :user-agent`, {
      stream: logStream,
    })(req, res, () => {})

    next()
  }
}
