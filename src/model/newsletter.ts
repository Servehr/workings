import { model, Schema }   from 'mongoose'

 
const NewsletterSchema = new Schema(
    { 
        email:      {  type: String, max: 30, lowercase: true, trim: true, unique: true, required : [true, 'Email is required'] },
    },
    { timestamps : true }
)

export default model<any>('Newsletter', NewsletterSchema)