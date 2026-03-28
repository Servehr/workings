require("dotenv").config();
import jwt  from  'jsonwebtoken';

const requireAuth = (req: any, res: any, next: any) => {

    const authHeader = req.headers.authorization;
    console.log("E reach here sef")
    console.log(authHeader)
    if(authHeader === "" || authHeader === null || authHeader === undefined)
    {
        res.status(403).json({status : 403, message : "Unauthorized", redirectTo : process.env.url });
    } else {
        const token = authHeader.split(' ')[1];
        if(token != null && token != undefined && token != "")
        {
            jwt.verify(token, 'inthebegining', (err: any, decodedToken: any) => {
                if(err)
                {
                    res.status(403).json({status : 403, message : "Unauthorized", redirectTo : process.env.url });
                } else {
                    next();
                }
            });
        } else {
            res.status(403).json({status : 403, message : "Unauthorized", redirectTo : process.env.url });
        }
    }

}

module.exports = { requireAuth };