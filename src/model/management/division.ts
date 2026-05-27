import mongoose, { model, Schema } from 'mongoose';

 
const DivisionSchema = new Schema(
    { 
        category:       {  type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
        name:           {  type : String, maxlength : 130, required : [true, 'division name is required'] },
        description:    {  type : String, maxlength : 100, required : [true, 'provide description for division '] },
        deletedAt:      {  type : Date, default : null  }
    },
    { timestamps : true }
)

export default model<any>('Division', DivisionSchema)