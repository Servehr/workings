import { Document } from 'mongoose';

export default interface IUser extends Document 
{
    firstname: string;
    surname: string;
    phone: string;
    email: string;
    password: string;
    status: string;
    userType: string;
    lastLoggedIn: string;
    token: string;
    role: string;
    deletedAt: Date;

    isValidPassword(password: string): Promise<Error | boolean>
}