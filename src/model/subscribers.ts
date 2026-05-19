import mongoose, { Schema, model }   from 'mongoose';

export const saltRounds = 4;

const SubscriberSchema = new Schema(
    {
        user:            {  type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        plan:            {  type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
        deletedAt:       {  type : Date, default: null  },
    },
    { timestamps: true }
);



export default model<any>('Subscriber', SubscriberSchema)

