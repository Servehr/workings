import jwt from 'jsonwebtoken';
import IToken from "@/interfaceIToken";
import IUser from '@/interfaceIUser';

export const createToken = (user: IUser) : string => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET as jwt.Secret, {
        expiresIn: '1d',
    });
};

export const verifyToken = async(
    token: any
): Promise<jwt.VerifyErrors | IToken> => 
{
    try
    {
      return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err: any, payload: any) => 
        {
          if(err) return reject(err)
            resolve(payload as IToken)
          }
       )
    });        
    } catch (error) {
        return new Promise((_, reject) => {
            return reject("Access denied")
        })
    }
};

export default { createToken, verifyToken }

