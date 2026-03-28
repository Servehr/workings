import { Document } from 'mongoose';

export default interface IUsers extends Document 
{
    firstname: string;
    surname: string;
    phone: string;
    email: string;
    password: string;
    status: string;
    userType: string;

    isValidPassword(password: string): Promise<Error | boolean>
}