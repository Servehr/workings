import mongoose, { Schema, model }   from 'mongoose';
import bcrypt from 'bcrypt';
import IUser from '@/interfaceIUser';

export const saltRounds = 4;

const adSchema = new Schema(
    { 
        name:           {  type: String, default: null },
        ad:             {  type: String, default: null },
        status:         {  type : String, enum: ['pending', 'suspended', 'active'], default : "pending", lowercase  : true },
        createdAt:      {  type : Date, default: null  },
        expiresAt:      {  type : Date, default: null  }
    }
);

const UserSchema = new Schema(
    {
        firstname:       {  type: String, max: 30, trim: true, lowercase: true, required : [true, 'Firstname is required'] },
        surname:         {  type: String, max: 30, trim: true, lowercase: true, required : [true, 'Surname is required']},
        phone:           {  type: String, max: 30, lowercase: true, trim: true, required : [true, 'Phone Number is required'] },
        email:           {  type : String, max : 30, lowercase  : true, trim  : true, unique: true, required : [true, 'Email is required'] },
        password:        {  type : String, required : [true, 'Password is required'] },
        status:          {  type : String, enum: ['pending', 'suspended', 'active', 'exited', 'scrutiney'], default : "pending", lowercase  : true },
        userType:        {  type : String, default : "guest", lowercase  : true },
        lastLoggedIn:    {  type: Date,  default: '' },
        profilePicture:  {  type : String, default: null },
        nin:             {  type : String },
        skills:          [  {  type: mongoose.Schema.Types.ObjectId, ref: 'Category', required : [true, 'at least a division is required'] }],
        category:        {  type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
        department:      {  type: mongoose.Schema.Types.ObjectId, ref: 'Department', lowecase: true },
        role:            {  type: mongoose.Schema.Types.ObjectId, ref: 'Role', lowecase: true },
        resetPassword:   {  type: mongoose.Schema.Types.ObjectId, ref: 'ResetPassword', lowecase: true },
        activateAccount: {  type: mongoose.Schema.Types.ObjectId, ref: 'ActivateAccount', lowecase: true },
        country:         {  type: mongoose.Schema.Types.ObjectId, ref: 'Country', lowecase: true, default: null },
        state:           {  type: mongoose.Schema.Types.ObjectId, ref: 'State', lowecase: true, default: null },
        lga:             {  type: mongoose.Schema.Types.ObjectId, ref: 'LGA', lowecase: true, default: null },
        // newsletter:      {
        //                     registered: { type: Boolean, default: false },  
        //                     email:  {  type : String, max : 30, default: null, lowercase  : true, trim  : true, unique: true, required : [true, 'Email is required'] },
        //                  },
        // newsletter:      {  type: mongoose.Schema.Types.ObjectId, ref: 'Newsletter', lowecase: true, default: null },
        advert:          adSchema,
        longitude:       {  type: String, default: null },
        latitude:        {  type: String, default: null },
        company:         {  type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        deletedAt:       {  type : Date, default : Date.now  },
    },
    { timestamps: true }
);

UserSchema.pre('save', async function(next)
{
    if(!this.isModified('password'))
    {
        return next();
    }
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
    next();
})

UserSchema.methods.isValidPassword = async function(password: string): Promise<Error | boolean>
{
   return await bcrypt.compare(password, this.password);
}

UserSchema.post('save', function(error: any, doc: any, next: any)
{
    // do something;
    next();
});

export default model<IUser>('User', UserSchema)

