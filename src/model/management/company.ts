import mongoose, { model, Schema } from 'mongoose';


 const CompanySchema = new Schema(
     { 
         logo:           {  type : String, maxlength : 1000, unique : true, required : [true, 'url name is required'] },
         name:           {  type : String, maxlength : 130, unique : true, required : [true, 'company name is required'] },
         address:        {  type : String, maxlength : 130, unique : true, required : [true, 'address name is required'] },
         page:           [  { type: mongoose.Schema.Types.ObjectId, ref: 'Page', default: [] }  ],
         deletedAt:      {  type : Date, default : null  },
     },
     { timestamps : true }
 );
 
 export default model<any>('Company', CompanySchema)