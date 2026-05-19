import mongoose, { model, Schema } from 'mongoose';

 
const LGASchema = new Schema(
    { 
        name:           {   type : String, maxlength : 130, unique : true, required : [true, 'lga name is required'] },
        country:        {  type: mongoose.Schema.Types.ObjectId, ref: 'Country', default: null, required : [true, 'country is required'] },
        state:        { type: mongoose.Schema.Types.ObjectId, ref: 'State', default: null, required : [true, 'state name is required'] },
        deletedAt:      {  type : Date, default : null  },
    },
    { timestamps : true }
);

export default model<any>('Lga', LGASchema) 