
import { Request } from "express";
import IUsers from "@/interfaceIUsers";
import User from "@/model/user";
import mongoose, { Types } from "mongoose";

interface IProfile 
{
    firstname: string
    surname: string
    phone: string
    email: string
    status: string
}

class UserService {

    public async profile(user: string): Promise<IUsers | Object>
    {
      // const userId = new Types.ObjectId(user)
      if(!mongoose.isValidObjectId(user)) 
      {
         return [] 
      }
      let userExist = User.findById({ _id: user })
      if(!userExist)
      {
         return []
      }
      return await User.find({ _id: user }).select('-_id firstname surname phone email userType')
        
    }
}

export default UserService;