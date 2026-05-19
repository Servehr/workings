import { Twilio } from "twilio";



class NotificationService {

    
    public async SendSms(phoneNumber: string, message: string): Promise<Error | String | any>
    {

      const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
      const authToken = process.env.TWILIO_AUTH_TOKEN as string;
      const client = new Twilio(accountSid, authToken);

      try 
      {
         const response = await client.messages.create(
          {
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
          }
         );
         const status: string = "Notification sent"
         return status
       } catch (error: any) {
           let RESPONSE: { message: any, statusCode: number, data: any } = 
           {
              message: error,
              statusCode: 404,
              data: null
           }
           throw new Error(JSON.stringify(RESPONSE)) 

       }       
    }
    

}

export default NotificationService;