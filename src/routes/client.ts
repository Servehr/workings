import express, { Express, Request, Response } from 'express';
const app = express();
const router = express.Router();
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
const upload = multer();
const { requireAuth }  =   require('../middlewares/checkAuth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

router.post('/', requireAuth, upload.none(), (req : Request, res : Response) =>
{    
    let company = require("../../controller/clients");
    company.addCompany(req.body, function(err : any, result : any) 
    {
        if(err && err != false)
        {
            res.json( { status : 500,  data : "Internal Server error" });
        } 
        else if(result == null)
        {
            res.json( { status : 200,  data : "Oops, something went wrong" });
        } else {
            res.json( { status : 200,  data : result });
        }
    });
});

router.get('/', requireAuth, (req : Request, res : Response) =>
{
    let company = require("../../controller/clients");
    company.allCompany(function(err : any, result : any)
    {
        if(err && err != false)
        {    
            res.json({ status : 500, data: "Internal server error" });  
        } else {
            if(result === null)
            {
                res.json({  status : 200,  data: "No Data Present" });
            } else {
                res.json({  status : 200,  result });
            }
        }
    });
});

router.put('/', requireAuth, upload.none(), (req : Request, res : Response) =>
{
    let company = require("../../controller/clients");
    company.modifyCompany(req.body, (err : any, result : any) =>
    {
        if(err && err !== false)
        {    
            res.json({ status : 500, data: "Internal server error" });  
        } else {
            res.json({ status : 200, data: result, msg : "Updated" });
        }
    });
});

router.get('/find/:id', requireAuth, upload.none(), (req : Request, res : Response) =>
{
    let id = req.params.id;
    let company = require("../../controller/clients");
    company.findCompany(id, (err : any, result : any) =>
    {
        if(err && err !== false)
        {    
            res.json({ status : 500, data: "Internal server error" });  
        } else {
            if(result === null)
            {
                res.json({  status : 400,  data: "No Data Found" });
            } else {
                res.json({  status : 200,  data: result });
            }
        }
    });
});

router.delete('/delete/:id', requireAuth, upload.none(), (req : Request, res : Response) =>
{
    const id   = req.params.id;
    let company = require("../../controller/clients");
    company.disable(id, (err : any, result : any) =>
    {
        if(err && err !== false)
        {    
            res.json({ status : 500, data: err });  
        } else {
            if(result === null)
            {
                res.json({  status : 200,  data: "Oops, something went wrong" });
            } else {
                res.json({  status : 200,  data: "Client Deleted", userDeleted : result });
            }
        }
    });
});

router.delete('/enable/:id', requireAuth, upload.none(), (req : Request, res : Response) =>
{
    const id   = req.params.id;

    let company = require("../../controller/clients");
    company.enable(req.body, (err : any, result : any) =>
    {
        if(err && err !== false)
        {    
            res.json({ status : 500, data: "Internal server error" });  
        } else {
            if(result === null)
            {
                res.json({  status : 200,  data: "Client Enabled" });
            } else {
                res.json({  status : 200,  data: "Oops, something went wrong" });
            }
        }
    });
});
 
module.exports = router;