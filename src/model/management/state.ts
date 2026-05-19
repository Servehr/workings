import mongoose, { model, Schema } from 'mongoose';

 
const StateSchema = new Schema(
    { 
        name:           {  type : String, maxlength : 130, unique : true, required : [true, 'state name is required'] },
        country:        {  type: mongoose.Schema.Types.ObjectId, ref: 'Country', default: null, required : [true, 'country is required'] },
        lgas:           [  { type: mongoose.Schema.Types.ObjectId, ref: 'Lga', default: [] }  ],
        deletedAt:      {  type : Date, default : null  },
    },
    { timestamps : true }
);

export default model<any>('State', StateSchema) 