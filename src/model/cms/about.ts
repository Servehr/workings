import { model, Schema } from 'mongoose';

 
const AboutSchema = new Schema(
    { 
        aboutus:           {   type : String, maxlength : 130, unique : true, required : [true, 'Category name is required'] }
    },
    { timestamps : true }
);

export default model<any>('About', AboutSchema) 