import app from "./config/app.config";
import connectDB from "./config/db.config";
import colors from "colors";
import seedData from "./config/seeds/seeder.seed";

const connect = async (): Promise<void> => {
  //connect database
  await connectDB();

  // seed data
  await seedData();

};
connect();

const PORT = process.env.PORT || 5003;

const server = app.listen(PORT, () => {
  console.log(
    colors.bold.yellow(`Node server running in ${process.env.NODE_ENV} mode`)
  );
});

//handle unhandleRejection error
process.on("unhandleRejection", (err: any, promise) => {
  console.log(colors.bold.red(`Error: ${err.message}`));
  server.close(() => process.exit(1));
});