import { model, Schema } from 'mongoose';

 
const PlanSchema = new Schema(
    { 
        plan:      {  type : String, maxlength : 130, unique : true, required : [true, 'plan name is required'] },
        price:     {  type: Number, max: 30, trim: true, required : [true, 'price is required'] },
    },
    { timestamps : true }
);

export default model<any>('Plan', PlanSchema) 