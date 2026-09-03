import { Request, Response, NextFunction } from 'express';

export const responseEnhancer = (req: Request, res: Response, next: NextFunction) => {
  
  res.sendSuccess = function <T>(data: T, message = 'Success', statusCode = 200) 
  {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  };

  res.sendError = function (message = 'Internal Server Error', statusCode = 500, data = null) 
  {
    return res.status(statusCode).json({
      status: 'error',
      message,
      ...(data && { data }),
    });
  };

  next();
};
