// validator.ts
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export function ValidateNewUser(dtoClass: any) 
{
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Transform plain request body into an instance of the DTO class
    const dtoInstance = plainToInstance(dtoClass, req.body);

    // 2. Validate the class instance
    const errors: ValidationError[] = await validate(dtoInstance, {
      whitelist: true,          // Strips properties that do not have decorators
      forbidNonWhitelisted: true // Throws an error if unknown properties are sent
    });

    // 3. If validation fails, format errors and return 400 Bad Request
    if (errors.length > 0) 
    {
      const formattedErrors = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints ? Object.values(err.constraints) : []
      }));

      // res.status(400).json({
      //   status: 'error',
      //   message: 'Validation failed',
      //   errors: formattedErrors
      // });

      return res.sendError('Validation failed', 500, formattedErrors);
      
    }

    // 4. Overwrite req.body with the sanitized/whitelisted instance
    req.body = dtoInstance;
    next();
  };
}

