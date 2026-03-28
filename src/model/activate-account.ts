import { Schema, model }   from 'mongoose';


const ActivateAccountSchema = new Schema(
    {
      userId:     { type : String, max : 30, lowercase  : true, trim  : true },
      hashString: { type : String, trim  : true },
      status:     { type: String, enum: ['expired', 'activated', 'pending'], default: 'pending', lowercase: true, trim: true },
      entry:      { type : Date, default : Date.now } 
    } 
);

export default model<any>('ActivateAccount', ActivateAccountSchema)

