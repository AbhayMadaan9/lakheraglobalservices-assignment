import bodyParser from "body-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import http from "http";
import morgan from "morgan";

import { loadConfig } from "./app/common/helper/config.hepler";
loadConfig();

import errorHandler from "./app/common/middleware/error-handler.middleware";
import routes from "./app/routes";
import { initDatabase } from "./database";
import User from "./database/models/tUser";
import { initPassport } from "./app/common/services/passport-jwt.service";



declare global {
  namespace Express {
    interface IUser extends Omit<User, "password"> { }
    interface Request {
      user?: IUser;
    }
  }
}

const port = Number(process.env.PORT) ?? 5000;

const app: Express = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

const initApp = async (): Promise<void> => {
  //init passport
  initPassport()

  // init mongodb
  await initDatabase();

  // set base path to /api
  app.use("/api", routes);

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  // error handler
  app.use(errorHandler);
  http.createServer(app).listen(port, () => {
    console.log("Server is runnuing on port", port);
  });
};

void initApp();
