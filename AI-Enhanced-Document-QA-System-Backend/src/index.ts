import { Application, urlencoded, json, static as estatic } from "express";
import * as fs from "fs";
import { WriteStream } from "fs";
import * as path from "path";
import rateLimiter from "./middlewares/rateLimit";
import { unCaughtErrorHandler } from "./handlers/errorHandler";
import Routes from "./routes";
import logger from "./logger";
import helmet from "helmet";
import cors from "cors"

export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  public config(app: Application): void {
    const accessLogStream: WriteStream = fs.createWriteStream(
      path.join(__dirname, "../logs/access.log"),
      { flags: "a" }
    );

    app.use("/public", estatic(__dirname + "/public"));
    app.use(json());
    app.use(cors());
    app.use(urlencoded({ extended: true }));
    app.use(helmet());
    app.use(rateLimiter()); //  apply to all requests
    app.use(unCaughtErrorHandler);
    app.set("trust proxy", false); // only if the server is behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  }
}

process.on("beforeExit", function (err) {
  logger.error(JSON.stringify(err));
  console.error(err);
});
