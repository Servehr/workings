import Pusher from 'pusher';
import * as dotenv from 'dotenv';

dotenv.config();

class PusherService {

  private static instance: PusherService;
  private pusher: Pusher;

  private constructor() 
  {
    // Initialize Pusher with environment variables
    this.pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID || '',
      key: process.env.PUSHER_KEY || '',
      secret: process.env.PUSHER_SECRET || '',
      cluster: process.env.PUSHER_CLUSTER || '',
      useTLS: true,
    });
  }

  // Singleton instance
  public static getInstance(): PusherService 
  {
    if (!PusherService.instance) 
    {
      PusherService.instance = new PusherService();
    }
    return PusherService.instance;
  }

  // Reusable trigger method
  public async trigger(channel: string, event: string, data: any) 
  {
    try 
    {
      await this.pusher.trigger(channel, event, data);
      console.log(`Pusher event ${event} triggered on ${channel}`);
    } catch (error) {
      console.error('Pusher trigger error:', error);
      throw error;
    }
  }
}

export default PusherService.getInstance();
