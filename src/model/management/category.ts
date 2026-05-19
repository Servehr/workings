import mongoose, { model, Schema } from 'mongoose';

 
const CategorySchema = new Schema(
    { 
        divisions:      [  { type: mongoose.Schema.Types.ObjectId, ref: 'Division', default: [] }  ],
        name:           {   type : String, maxlength : 130, unique : true, required : [true, 'Category name is required'] },
        description:    {   type : String, maxlength : 100, required : [true, 'Provide category description'] },
        deletedAt:      {  type : Date, default : null  },
    },
    { timestamps : true }
);

export default model<any>('Category', CategorySchema) 