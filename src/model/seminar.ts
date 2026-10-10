import { model, Schema } from 'mongoose';

 
const SeminarSchema = new Schema(
    { 
        title:      {  type: String, maxlength: 100, required : [true, 'title is required'] },
        logo:       {  type: String, max: 30, required : [true, 'logo is required'] },
        location:   {  type: String, max: 200, trim: true, required : [true, 'location is required'] },
        time:       {  type: String, max: 30, trim: true, required : [true, 'time is required'] },
        date:       {  type: String, max: 30, trim: true, required : [true, 'date is required'] },
        host:       {  type: String, max: 30, trim: true, required : [true, 'host is required'] },
        about:      {  type: String, max: 30, trim: true, required : [true, 'about is required'] },
        speakers:   [  
                      { title: { type: String, default: false } },
                      { name: { type: String, default: null } },
                      { url: { type: String, default: null } },
                      { line: { type: String, default: null } },
                      { title: { type: String, default: false } },
                    ],
        facebook:   {  type: String, max: 30, trim: true, default: null },
        youtube:    {  type: String, max: 30, trim: true, default: null },
        tiktok:     {  type: String, max: 30, trim: true, default: null },
        instagram:  {  type: String, max: 30, trim: true, default: null },
        twitch:     {  type: String, max: 30, trim: true, default: null },
        x:          {  type: String, max: 30, trim: true, default: null },

    },
    { timestamps : true }
);

export default model<any>('Plan', SeminarSchema) 