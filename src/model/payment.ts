import mongoose, { model, Schema }   from 'mongoose'

 
const PaymentSchema = new Schema(
    { 
        user:               { type: mongoose.Schema.Types.ObjectId, ref: 'User', default : null, required : [true, 'transactionId is required']  },
        transactionId:      {  type: String, max: 20, trim: true },
        reference:          {  type: String, max: 30, trim: true },
        domain:             {  type: String, max: 30, trim: true },
        status:             {  type: String, max: 10, trim: true },
        receipt_number:     {  type: String, max: 100, trim: true },
        amount:             {  type: Number },
        responseCode:       {  type: String, trim: true },
        paidAt:             {  type: String, trim: true },
        createdAt:          {  type: String, trim: true },
        channel:            {  type: String, trim: true },
        currency:           {  type: String, trim: true },
        ipAddress:          {  type: String, trim: true },
        referer:            {  type: String, trim: true },
        customerId:         {  type: String, max: 50 },
        customerFirstname:  {  type: String, max: 50},
        customerLastname:   {  type: String, max: 50 },
        customerEmail:      {  type: String, max: 50 },
        customerPhone:      {  type: String, max: 50 },
        customerRiskAction: {  type: String, max: 50 },

    },
    { timestamps : true }
);


export default model<any>('Payment', PaymentSchema)