import { Request, Response, NextFunction } from 'express';
import HttpException from '@/exception/http.exception';


// export const responseEnhancer = (req: Request, res: Response, next: NextFunction) => {
function errorMiddleware(
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) : void {

    const status = error.status || 500;
    const message = error.message || "Internal Server Error";
    console.log("Is it me")
    
    res.status(status).send(
      {
        status, message
      }
    )
    return
}

export default errorMiddleware;


// import { Request, Response, NextFunction } from 'express';
// import { ErrorMessages } from '../enums/messages/error-messages.enum';
// import { IHTTPError } from '../models/extensions/errors.extension';

// export const exceptionHandler = (
//   error: IHTTPError,
//   req: Request,
//   res: Response,
//   _next: NextFunction // we won't be calling next() here
// ) => {
//   const statusCode = error.statusCode || 500;
//   const message = error.message || ErrorMessages.Generic;

//   // logger

//   return res.status(statusCode).send({ statusCode, message });
// };