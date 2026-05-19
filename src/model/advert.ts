import mongoose, { model, Schema } from 'mongoose';

 
const advertSchema = new Schema(
    { 
        user:            {  type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name:           {  type: String, default: null },
        ad:             {  type: String, default: null },
        status:         {  type : String, enum: ['pending', 'suspended', 'active'], default : "pending", lowercase  : true },
        createdAt:      {  type : Date, default: null  },
        expiresAt:      {  type : Date, default: null  }
    },
    { timestamps : true }
);

export default model<any>('Advert', advertSchema) 