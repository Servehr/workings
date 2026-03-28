import { model, Schema }  from 'mongoose';


const CompanySchema = new Schema({ 

    name:           {  type : String, max : 30 },
    branches:       {  type : [Schema.Types.ObjectId], ref : 'Branches' },
    abbr:           {  type : String },
    active:         {  type : Boolean, default : 1 },
    entry:          {  type : Date, default : Date.now }

});

export default model<any>('Company', CompanySchema)