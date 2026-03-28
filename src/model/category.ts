import mongoose, { model, Schema } from 'mongoose';

 
const CategorySchema = new Schema(
    { 
        name:           {   type : String, maxlength : 130, unique : true, required : [true, 'Category name is required'] },
        description:    {   type : String, maxlength : 100, required : [true, 'Provide category description'] }
    },
    { timestamps : true }
);

export default model<any>('Category', CategorySchema); 