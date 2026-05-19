import { random } from '@/helper/random';
import mongoose, { Schema, model }   from 'mongoose';

export const saltRounds = 4;

const JObSchema = new Schema(
    {
        user:            {  type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        tag:             {  type: String, default: null, uppercase: true  },
        longitude:       {  type: String, max: 30, trim: true, required : [true, 'longitude is required'] },
        latitude:        {  type: String, max: 30, trim: true, required : [true, 'latitude is required'] },
        category:        {  type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: [] },
        divisions:       [  {  type: mongoose.Schema.Types.ObjectId, ref: 'Division', required : [true, 'at least a division is required'] }],
        status:          {  type : String, enum: ['active', 'cancelled', 'flagged'], default : "active", lowercase  : true },
        information:     {  type: String, max: 30, trim: true, required : [true, 'information is required']},
        deletedAt:       {  type : Date, default: null  },
    },
    { timestamps: true }
);



export default model<any>('Job', JObSchema)

