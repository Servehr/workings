import mongoose, { model, Schema }  from 'mongoose';


const ResetPasswordHistorySchema = new Schema(
    {
        userId:     { type : String, max : 30, lowercase  : true, trim  : true },
        hashString: { type : String, trim  : true },
        entry:      { type : Date, default : Date.now } 
    } 
);

ResetPasswordHistorySchema.pre('save', async function(next)
{
    next();
});

ResetPasswordHistorySchema.statics.resetData = function(userId: number)
{
    return this.where('id').equals(userId).select('userId hashString');
};

ResetPasswordHistorySchema.statics.doesExist = function(userId: number)
{
    return this.where('id').equals(userId).count();
};


export default model<any>('ResetPasswordHistory', ResetPasswordHistorySchema)

