import { Router, Request, Response, NextFunction } from "express";
import multer = require("multer");
import DataAnalyzerCtrl from "../controllers/DataAnalyzerCtrl";
import {
  DataAnalyzerValidator,
  dataAnalyzerSchema,
} from "../validators/DataAnalyzerValidator";
import path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use path.join to ensure cross-platform compatibility
    cb(null, path.join(__dirname, '../public/uploaded_files'));
  },
  filename: function (req, file, cb) {
    // Add a unique identifier to avoid file name collisions
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const allowedMimes = [
  'application/pdf',
  'application/x-pdf',
  'application/acrobat',
  'application/vnd.pdf',
  'text/plain',
  'text/x-plsql',
  'text/x-java-source'
];

const fileFilter = (
  req: any,
  file: { mimetype: string },
  cb: (arg0: null, arg1: boolean) => void
) => {
  // check file type
  if (allowedMimes.includes(file.mimetype)) {
    // tslint:disable-next-line:no-null-keyword
    cb(null, true);
  } else {
    // tslint:disable-next-line:no-null-keyword
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});

const documentUploader = upload.single("file");

const dataAnalyzerValidator = new DataAnalyzerValidator();

class DataAnalyzerRoutes {
  router = Router();
  dataAnalyzerCtrl = new DataAnalyzerCtrl();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router
      .route("/upload")
      .post((req: Request, res: Response, next: NextFunction) => {
        documentUploader(req, res, function (err) {
          if (err instanceof multer.MulterError) {
            return res.status(422).json({
              success: false,
              errors: [
                "Error uploading file. Check if the file size is less than 10mb and is of type PDF or Plain Text.",
              ],
            });
          } else if (err) {
            console.log(err);
            return res.status(422).json({
              success: false,
              errors: [
                "Error uploading file. Check if the file.",
              ],
            });
          }

          next();
        });
      }, this.dataAnalyzerCtrl.uploadFile);

    this.router
      .route("/createindex")
      .post(this.dataAnalyzerCtrl.CreatePineconeIndex);

    this.router.route("/checkindex").post(this.dataAnalyzerCtrl.CheckIndex);

    this.router
      .route("/ask")
      .post(
        dataAnalyzerValidator.validateData(dataAnalyzerSchema),
        this.dataAnalyzerCtrl.AnswerQuestionFromIndex
      );
      
    this.router
      .route("/removeindex")
      .post(this.dataAnalyzerCtrl.RemovePineconeIndex);
  }
}
export default new DataAnalyzerRoutes().router;
