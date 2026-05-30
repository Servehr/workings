import mongoose, { Schema, model }   from 'mongoose';

 
const fastResponseSchema = new Schema(
    { 
        firstname:       {  type: String, max: 30, trim: true, lowercase: true, required : [true, 'Firstname is required'] },
        surname:         {  type: String, max: 30, trim: true, lowercase: true, required : [true, 'Surname is required']},
        phone:           {  type: String, max: 30, lowercase: true, trim: true, required : [true, 'Phone Number is required'] },
        email:           {  type: String, max : 30, lowercase  : true, trim  : true, required : [true, 'Email is required'] },
        message:         {  type: String, max: 1000, trim: true, lowercase: true, required : [true, 'Kindly, leave a message'] },
        deletedAt:       {  type: Date, default : null  },
    },
    { timestamps : true }
);

export default model<any>('fastForm', fastResponseSchema)