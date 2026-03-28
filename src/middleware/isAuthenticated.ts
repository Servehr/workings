import { Router, Request, Response, NextFunction } from "express";


export const IsAuthenticated = (req: Request, res: Response, next: NextFunction) => 
{
    if(req.session && req?.session?.user) 
    {
      next();
    } else {
      res.status(401).send('User session has expired');
    }
}