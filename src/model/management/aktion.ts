import { model, Schema } from 'mongoose';

 
const AktionSchema = new Schema(
    { 
        name:           {   type : String, maxlength : 130, unique : true, required : [true, 'Category name is required'] },
        description:    {   type : String, maxlength : 100, required : [true, 'Provide category description'] },
        deletedAt:       {  type : Date, default : null  },
    },
    { timestamps : true }
);

export default model<any>('Aktion', AktionSchema) 