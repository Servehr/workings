import mongoose, { Schema, model }   from 'mongoose';
import { IUserType } from '@/interfaceIUserType';
const UserType = mongoose.Schema;

const UserTypeSchema = new UserType(
    { 
        name:           { type : String, maxLength : 25, required : [true, 'Type name is required'] },
        abbr:           { type : String, maxLength : 25, required : [true, 'Abbreviation for user type is required'] },
        slug:           { type : String, maxLength : 25, required : [true, 'Abbreviation for user type is required'] },
        description:    { type : String, maxLength : 255, required : [true, 'Abbreviation for user type is required'] },
        entry:          { type : Date,   default : Date.now }
    }
);

UserTypeSchema.statics.userType = function(userType: string)
{
    return this.where('name').equals(userType).select('_id name abbr');
}

UserTypeSchema.statics.userTypeId = function(userType: string)
{
    return this.where('name').equals(userType).select('_id');
}

export default model<IUserType>('UserType', UserTypeSchema);