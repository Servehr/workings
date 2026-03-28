import express, { Express, Request, Response } from 'express';
import session from 'express-session';
const router = express.Router();
require("dotenv").config();
import path from 'path';
import cors from 'cors';
import cookieParser from  'cookie-parser';
import bodyParser from 'body-parser';

const auth      = require('./routes/authenticate/authenticate');
const booking   = require('./routes/booking/bookings');
const privilege = require('./routes/authorize/privilege');
const role      = require('./routes/authorize/role');
// const authorize = require('./routes/authorize/authorize');

// const attach = require('./routes/excel.js');
// const user = require('./routes/user.js');
// const company = require('./routes/client.js');
// const branch = require('./routes/branch.js');
// const process = require('./routes/process.js');
// const designation = require('./routes/designation.js');

const { requireAuth }  =   require('./middlewares/checkAuth');

const app: Express = express();

app.use(cors({
    origin: '*'
}));
 
// app.use('/static', express.static(path.join(__dirname, 'public/bio')))

app.set('view engine', 'ejs');

// const duration : number = 1000 * 60 * 60 * 23;
const duration : number = 1000 * 60 * 60 * 23;
app.use(session(
   {
     name : "fantasy",
     secret : "T51oAKERKt1D470KYja35YAAxo5yOsbBOxnyNm92QU3hf",
     resave : false,
     saveUninitialized : false,
     cookie : { maxAge : duration }
   }
)); 

app.use(cookieParser());
app.use(bodyParser.json());

app.get('/', (req : Request, res : Response) => 
{
    res.render('index', { pics : "https://icsrecruitment.bcodestech.com/static/nosering1656599551591.png" });
});      

app.get('/login', (req : Request, res : Response)  => 
{
    res.render('login');
});     

app.get('/dashboard', requireAuth, (req : Request, res : Response) => 
{
    res.render('dashboard');
});                       

app.use('/api', auth);
app.use('/api/booking', requireAuth, booking);
app.use('/api/privilege', privilege);
app.use('/api/role', role);
// app.use('/api/authorize', authorize);

// app.use('/api/user', user);
// app.use('/api/branch', branch);
// app.use('/api/bio', bio);
// app.use('/api/company', company);

app.listen(process.env.PORT, () =>
{
    console.log("Listening to requests on port " + process.env.PORT);
});