import * as express from 'express';

declare global {
  namespace Express {
    interface Response {
      sendSuccess<T>(data: T, message?: string, statusCode?: number): void;
      sendError(message: string, statusCode?: number, details?: any): void;
    }
  }
}