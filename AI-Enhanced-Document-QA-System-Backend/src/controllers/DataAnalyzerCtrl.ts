import { Request, Response, NextFunction } from "express";
import DataAnalyzerRepo from "../repositories/DataAnalyzerRepo";
import ResponseJSON from "../middlewares/ResponseJSON";
import errorMessages from "../constants/errorMessages";
import httpStatusCodes from "../constants/httpStatusCodes";
import { apiErrorHandler } from "../handlers/errorHandler";
import pdfParse from "pdf-parse";
import fs from "fs";
import {
  generateEmbeddings,
  chunkText,
  storeInPinecone,
} from "../middlewares/utils";

export default class DataAnalyzerCtrl {
  constructor() {}

  /*
    upload file  
  */
  uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      let text = "";

      if (!file) {
        return res
          .status(httpStatusCodes.BAD_REQUEST)
          .json(
            new ResponseJSON(
              "No file uploaded",
              true,
              httpStatusCodes.BAD_REQUEST
            )
          );
      }

      // Read file as a buffer
      const fileBuffer = await fs.promises.readFile(file.path);

      if (file.mimetype === "application/pdf") {
        const data = await pdfParse(fileBuffer); // Pass buffer to pdfParse
        text = data.text;
      } else if (file.mimetype === "text/plain") {
        text = fileBuffer.toString(); // Convert buffer to string for plain text
      } else {
        return res
          .status(httpStatusCodes.BAD_REQUEST)
          .json(
            new ResponseJSON(
              "Unsupported file type",
              true,
              httpStatusCodes.BAD_REQUEST
            )
          );
      }

      // Perform text chunking, NER, and embedding

      const chunks = chunkText(text);
      const embeddings = await generateEmbeddings(chunks);
      await storeInPinecone(embeddings);

      return res
        .status(httpStatusCodes.OK)
        .json(
          new ResponseJSON(
            "Document processed and stored successfully.",
            false,
            httpStatusCodes.OK
          )
        );
    } catch (error) {
      console.error(error);
      return res
        .status(httpStatusCodes.INTERNAL_SERVER)
        .json(
          new ResponseJSON(
            "Failed to process document",
            true,
            httpStatusCodes.INTERNAL_SERVER
          )
        );
    }
  };

  /*
    Create Index
  */
  CreatePineconeIndex = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    DataAnalyzerRepo.CreateIndex()
      .then((result) => {
        res
          .status(httpStatusCodes.OK)
          .json(
            new ResponseJSON("Index created", false, httpStatusCodes.OK, result)
          );
      })
      .catch((error) => {
        next(
          apiErrorHandler(
            error,
            req,
            res,
            errorMessages.BAD_REQUEST,
            httpStatusCodes.BAD_REQUEST
          )
        );
      });
  };

  /*
    Check availability of the Index
  */
  CheckIndex = async (req: Request, res: Response, next: NextFunction) => {
    DataAnalyzerRepo.CheckIndex()
      .then((result) => {
        res
          .status(httpStatusCodes.OK)
          .json(
            new ResponseJSON(
              "Index Available",
              false,
              httpStatusCodes.OK,
              result
            )
          );
      })
      .catch((error) => {
        console.log(error);
        next(
          apiErrorHandler(
            error,
            req,
            res,
            errorMessages.BAD_REQUEST,
            httpStatusCodes.BAD_REQUEST
          )
        );
      });
  };

  /*
    Search data from pinecone 
  */
  AnswerQuestionFromIndex = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    DataAnalyzerRepo.AnswerQuestion(req.body.inputData)
      .then((result) => {
        res
          .status(httpStatusCodes.OK)
          .json(
            new ResponseJSON("Search Result", false, httpStatusCodes.OK, result)
          );
      })
      .catch((error) => {
        console.log(error);
        next(
          apiErrorHandler(
            error,
            req,
            res,
            errorMessages.BAD_REQUEST,
            httpStatusCodes.BAD_REQUEST
          )
        );
      });
  };

  /*
    Remove Index
  */
  RemovePineconeIndex = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    DataAnalyzerRepo.RemoveIndex()
      .then((result) => {
        res
          .status(httpStatusCodes.OK)
          .json(
            new ResponseJSON("Index Removed", false, httpStatusCodes.OK, result)
          );
      })
      .catch((error) => {
        console.log(error);
        next(
          apiErrorHandler(
            error,
            req,
            res,
            errorMessages.BAD_REQUEST,
            httpStatusCodes.BAD_REQUEST
          )
        );
      });
  };
}
