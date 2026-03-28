import { Router, Request, Response, NextFunction } from "express";
import User from "@/model/user";
import IToken from "@/interfaceIToken";
import HttpException from "@/exception/http.exception";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { verifyToken } from "@/helper/token";

async function authenticateMiddleware(    
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;
    if(!bearer || !bearer.startsWith('Bearer '))
    {
        return next(new HttpException(401, 'Unauthorized'))
    }
    try 
    {
        const accessToken = bearer?.split('Bearer ')[1].trim()
        const payload: IToken | VerifyErrors = await verifyToken(accessToken)
        if(payload instanceof jwt.JsonWebTokenError)
        {
            return next(new HttpException(401, 'Unauthorized'))
        }
        const user = await User.findById(payload.id)
                    .select('password')
                    .exec()
        if(!user)
        {
           return next(new HttpException(401, 'UnAuthorized'))
        }
        return next()
    } catch (error: any) {
        return next(new HttpException(401, 'Unauthorized'))
    }

}

export default authenticateMiddleware;