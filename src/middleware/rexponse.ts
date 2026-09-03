import { Response } from 'express';

export class Rexponse {

  static success<T>(res: Response, data: T, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({ success: true, message, data });
  }

  static error(res: Response, message = 'Error', statusCode = 400, details = null) {
    res.status(statusCode).json({ success: false, message, error: details });
  }
}
