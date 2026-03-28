import express, { Express, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const app = express();

const requireAuth = (req: Request, res: Response, next: any) => {

    const token = req.cookies.bct;
    if(token)
    {
        jwt.verify(token, 'inthebegining', (err: any, decodedToken: any) => {
            if(err)
            {
                res.json({status : 403, message : "Unauthorized", redirectTo : "https://recruitment.com/login" });
            } else {
                next();
            }
        });
    } else {
        res.json({status : 403, message : "Unauthorized", redirectTo : "https://recruitment.com/login" });
    }

}

module.exports = { requireAuth };