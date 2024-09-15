import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/error.util";

// Extend Express Request interface to include optional 'language' and 'channel' fields
declare global {
  namespace Express {
    interface Request {
      language?: any;
      channel?: any;
    }
  }
}

// Middleware function to validate language and channel in request headers
export const validateChannels = (req: Request, res: Response, next: NextFunction) => {
  
  // Check if the APP_CHANNELS environment variable is declared
  if (!process.env.APP_CHANNELS) {
    return next(
      new ErrorResponse("Error", 500, [
        "There is an error, please contact support",
      ])
    );
  }

  const channelsStr: string = process.env.APP_CHANNELS;

  try {
    if (!req.headers.lg && !req.headers.ch) {
      return next(
        new ErrorResponse("Security Violation", 403, [
          "There is an error, please contact support",
        ])
      );
    }

    // Check if the 'lg' (language) header is present
    if (!req.headers.lg) {
      return next(
        new ErrorResponse("Security Violation", 403, ["language not specified"])
      );
    }

    if (!req.headers.ch) {
      return next(
        new ErrorResponse("Security Violation", 403, ["channel not specified"])
      );
    }

    // Extract 'ch' (channel) and 'lg' (language) from request headers
    const ch: string = req.headers.ch.toString();
    const lg: string = req.headers.lg.toString();
    const channels = channelsStr.split(",");

    // Ensure that the language ('lg') length is valid (<= 2 characters)
    if (lg.length > 2) {
      return next(
        new ErrorResponse("Security Violation", 403, ["language not specified"])
      );
    }


// Ensure the channel ('ch') is a valid channel (exists in the APP_CHANNELS list)
    if (!channels.includes(ch)) {
      return next(
        new ErrorResponse("Security Violation", 403, ["channel not specified"])
      );
    }

// If valid, set language and channel in the request object
    req.language = lg;
    req.channel = ch;

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
      // Handle any unexpected errors
    return next(
      new ErrorResponse("Server Error", 500, ["An unexpected error occurred"])
    );
  }
};

// export default validateChannels;
