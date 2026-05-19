import mongoose, { model, Schema } from 'mongoose';

 
const PageSchema = new Schema(
    { 
        deletedAt:      {  type : Date, default : null  },
    },
    { timestamps : true }
);

export default model<any>('Page', PageSchema) 