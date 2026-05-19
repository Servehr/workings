import mongoose, { model, Schema } from 'mongoose';

 
const CountrySchema = new Schema(
    { 
        name:           {  type : String, maxlength : 130, unique : true, required : [true, 'country name is required'] },
        states:         [  { type: mongoose.Schema.Types.ObjectId, ref: 'State', default: [] }  ],
        deletedAt:      {  type : Date, default : null  },
    },
    { timestamps : true }
);

export default model<any>('Country', CountrySchema) 