import { model, Schema }  from 'mongoose'


const ResetPasswordSchema = new Schema(
    {
      userId:     { type : String, max : 30, lowercase  : true, trim  : true },
      hashString: { type : String, trim  : true },
      entry:      { type : Date, default : Date.now } 
    } 
);

ResetPasswordSchema.pre('save', async function(next)
{
    next();
});

ResetPasswordSchema.statics.resetData = function(userId: number)
{
    return this.where('id').equals(userId).select('userId hashString');
};

ResetPasswordSchema.statics.doesExist = function(userId: number)
{
    return this.where('id').equals(userId).count();
};


export default model<any>('ResetPassword', ResetPasswordSchema)

