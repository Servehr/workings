import { model, Schema } from 'mongoose';


 const FaqSchema = new Schema(
     { 
        title:           {  type : String, maxlength : 100, unique : true, required : [true, 'title is required'] },
        content:         {  type : String, maxlength : 1000, unique : true, required : [true, 'content is required'] },
        deletedAt:       {  type : Date, default : null  },
     },
     { timestamps : true }
 );
 
 export default model<any>('faq', FaqSchema)