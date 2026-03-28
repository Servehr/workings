import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import morgan from 'morgan';
import Controller from '@/interfaceIController';
import cors from 'cors';
import session from 'express-session';
import cookieParser from  'cookie-parser';
import bodyParser from 'body-parser';
import errorMiddleware from './middleware/error/error.middleware';
import helmet from 'helmet';
import MongoStore from 'connect-mongo';


class App {

    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number)
    {
        this.express = express();
        this.port = port;
        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private initializeMiddleware() : void 
    {
        const { BASE_URL, DB } = process.env;
        
        this.express.use(express.json())
        this.express.use(cookieParser())
        this.express.use(bodyParser.json())

        this.express.use(helmet())
        this.express.use(cors(
          {
            origin: 'http://localhost:6417',
            credentials: true
          }
        ))

        const store = MongoStore.create({
           mongoUrl: `${BASE_URL}/${DB}`,
           ttl: 14 * 24 * 60 * 60, // Session expiration in seconds (14 days)
           autoRemove: 'native' // Default mode, MongoDB handles expired sessions
        })

        // Configure the express-session middleware
        this.express.use(
          session({
            secret: process.env.SECRET || 'THrgGU4&5gT£Tf6cUDdGK581BrtRQtC', // Use a strong secret from .env
            resave: false, // Prevents saving the session back to the store if not modified
            saveUninitialized: true, // Prevents saving new, uninitialized sessions
            store: store,
            cookie: {
              maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie expiration (1 week)  // 1000 * 60 * 60 * 24 * 7,        //  (days * 24 * 60 * 60 * 1000)
              //   secure: false, //process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
              httpOnly: true, // Prevents client-side JavaScript access
              //   sameSite: 'lax',              
            },
          })
        )    
        
        this.express.use(morgan('dev'));
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    private initializeControllers(controllers: Controller[]): void
    {
        controllers.forEach((controller: Controller) => 
        {
            this.express.use('/api', controller.router);
        });
    }

    private initializeErrorHandling(): void
    {
        this.express.use(errorMiddleware);
    }

    private initializeDatabaseConnection(): void
    {
        const { BASE_URL, DB } = process.env;
        // mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`);
        mongoose.connect(`${BASE_URL}/${DB}`)
    }

    public listen(): void
    {
        this.express.listen(this.port, () => 
        {
           console.log(`Application listening on port ${this.port}`);
        })
    }

}

export default App;