// Import necessary types and modules from "express" and other utilities
import { Request, Response, NextFunction } from "express";
import ENV from "../utils/env.util"; // Custom environment utility
import ErrorResponse from "../utils/error.util"; // Custom error response utility
import logger from "../utils/logger.util"; // Custom logger utility

// Define the error handler middleware function
const errorHandler = (
  err: any, // The error object that will be passed
  req: Request, // Express Request object
  res: Response, // Express Response object
  next: NextFunction // Next middleware function in the stack
) => {
  // Define a default message and error array to store specific error messages
  let message: string = "";
  let errors: Array<any> = [];
  let error = { ...err }; // Clone the error object

  // If the error has an `errors` field (likely from Mongoose validation), process it
  if (err.errors) {
    errors = Object.values(err.errors).map((item: any) => {
      let result: any;
      // If the error item has properties, extract the message
      if (item.properties) {
        result = item.properties.message;
      } else {
        // Otherwise, return the item itself
        result = item;
        return result;
      }
    });

    // Log the error to the console if in development or staging environments
    if (ENV.isDev() || ENV.isStaging()) {
      logger.log({ data: err, label: "ERR" });
    }

    // Handle Mongoose bad ObjectID error (invalid object ID casting)
    if (err.name === "CastError") {
      message = "Resource not found - id cannot be casted";
      error = new ErrorResponse(message, 500, errors);
    }

    // Handle Mongoose duplicate key error (duplicate key violation)
    if (err.code === 11000) {
      message = "Duplicate field value entered for the resource";
      error = new ErrorResponse(message, 500, errors);
    }

    // Handle Mongoose validation error
    if (err.code === "ValidationError") {
      message = "Validation error occurred - check the fields you entered";
      error = new ErrorResponse(message, 500, errors);
    }

    // Handle Mongoose reference error (invalid reference in DB)
    if (err.code === "referenceError") {
      message = "Something is not right, check the fields you entered";
      error = new ErrorResponse(message, 500, errors);
    }

    // Return the error response with status code and detailed information
    res.status(error.statusCode || 500).json({
      error: true,
      errors: error.errors ? error.errors : [], // Pass specific error messages, if any
      data: error.data ? error.data : {}, // Include any relevant data
      message: error.message ? error.message : "Server Error", // Error message
      status: error.statusCode ? error.statusCode : 500, // HTTP status code
    });
  }
};

// Export the error handler to be used in the application
export default errorHandler;