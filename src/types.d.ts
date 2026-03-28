import "express-session";

declare module "express-session" {
  interface SessionData {
    user: { id: string, firstname: string, surname: string }
  }
}


declare global {
  namespace Express {
    interface Request {
      user?: object | string;
    }
  }
}