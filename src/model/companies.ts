import { model, Schema }  from 'mongoose';


const CompanySchema = new Schema({ 

    name:           {  type : String, max : 30 },
    branches:       {  type : [Schema.Types.ObjectId], ref : 'Branches' },
    url:            {  type : String, default: null },
    active:         {  type : Boolean, default: 1 },
    partners:       {  type: Boolean, default: 0 },
    entry:          {  type : Date, default : Date.now }

});

export default model<any>('Company', CompanySchema)