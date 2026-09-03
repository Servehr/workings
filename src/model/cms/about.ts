import { model, Schema } from 'mongoose';

 
const AboutSchema = new Schema(
    { 
        title:           { type : String, maxlength : 40, unique : true, required : [true, 'Title is required'] },
        aboutus:         { type : String, maxlength : 5000, unique : true, required : [true, 'About content is required'] },
        images:          { type : [String] },
        deletedAt:       {  type : Date, default : null  }
    },
    { timestamps : true }
);

export default model<any>('About', AboutSchema) 