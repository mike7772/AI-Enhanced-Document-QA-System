import { Application } from "express";
import DataAnalyzerRouter from "./DataAnalyzerRoutes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/documents", DataAnalyzerRouter);
  }
}
