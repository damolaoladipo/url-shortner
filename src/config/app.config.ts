// application configuration

import express, { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import { ENVType } from "../utils/enums.util";
import ENV from "../utils/env.util";
import ErrorResponse from "../utils/error.util";
import errorHandler from "../middleware/error.mdw";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import path from "path";
import expressSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import userAgent from "express-useragent";
import v1Routes from "../routes/v1/routers/routes.router";
import { limitRequests } from "../middleware/ratelimit.mdw";


//load my env vars
config();

const app = express();


//body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

//or

app.use(bodyParser.json({ limit: "50mb", inflate: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

//set view engine
app.set("view engine", "ejs");

//cookie parser
app.use(cookieParser());

//http logging middlwarea
if (ENV.isStaging() || ENV.isDev()) {
  app.use(morgan("dev"));
}


//temporary file directory
app.use(fileUpload({ useTempFiles: true, tempFileDir: path.join(__dirname, 'tmp') }))

/**
 * sanitize data
 * secure db with sql injection
 */
app.use(expressSanitize());

//secure http header
app.use(helmet());

//rate limiting
app.use(limitRequests);

// prevent http parameter pollution
app.use(hpp());

//enable CORS
app.use(cors({ origin: true, credentials: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Origin",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Origin",
    "x-acess-token, origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// set user agent
app.use(userAgent.express());

// mount application routers ( or routes )
app.get("/", (req: Request, res: Response, next: NextFunction) => {});

app.post("/regsiter", (req: Request, res: Response, next: NextFunction) => {
 console.log(req.body);
});

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  
  let environment = ENVType.DEVELOPMENT

  if (ENV.isProduction()) {
    environment = ENVType.PRODUCTION;
  } else if (ENV.isStaging()) {
    environment = ENVType.STAGING
  } else if (ENV.isDev()) {
    environment = ENVType.DEVELOPMENT
  }

  res.status(200).json({
    error: false,
    errors: [],
    data: { name: "ULR Shortner API - DEFAULT", 
      version: "1.0.0" 
    },
    message: 'URL-shortner api v1.0.0',
    status: 200,
  });
});

// application version-one routes
app.use("/v1", v1Routes);

// mount errror handlers. This must be after you mount routers.
app.use(errorHandler);

export default app;
