import mongoose, { model, Schema } from 'mongoose';

 
const DepartmentSchema = new Schema(
    { 
        name:           {   type : String, maxlength : 130, unique : true, required : [true, 'department name is required'] },
        description:    {   type : String, maxlength : 100, required : [true, 'provide description for department '] },
        roles:          [  { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: [] }  ],
        deletedAt:       {  type : Date, default : null  }
    },
    { timestamps : true }
);

export default model<any>('Department', DepartmentSchema)