import mongoose, { Schema, model }   from 'mongoose';

 
const AktionSchema = new Schema(
    { 
        page:           { type: mongoose.Schema.Types.ObjectId, ref: 'Page', default: null },
        name:           { type : String, maxlength : 130, unique : true, required : [true, 'Category name is required'] },
        description:    { type : String, maxlength : 100, required : [true, 'Provide category description'] },
        deletedAt:      { type : Date, default : null  },
    },
    { timestamps : true }
);

export default model<any>('Aktion', AktionSchema) 