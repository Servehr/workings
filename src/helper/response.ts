import express, { Express, Request, Response } from 'express';
const app = express();
const dataInMemory = require("./memory");

exports.empty_message   =   function(req: Request, res: Response, statusCode: number, report: string)
{
    let text = "Enter Value for ";
    res.status(statusCode).json({message : text + report});
}

exports.handleErrors = (err: any) => 
{
    let errors: any = { email: '', password : '' };
    if(err.code === 11000)
    {
        errors.email = "Email already exist";
        return errors;
    }
    if(err.message.includes('user validation failed'))
    {
        Object.values(err.errors).forEach((properties: any) => 
        {
            errors[properties.path] = properties.message;
        });
    };
    return errors;
}

const sendResponse  = function(res: any, statusCode: number, message: string, response: any = null)
{   
    let http_code;
    switch(statusCode) 
    {
        case null:
            http_code = 420;           
            break;
        case 200:
            http_code = 200;
            break;
        default:
            http_code = statusCode;
            break;
    } 
    
    switch(response)
    {
        case '':
        case undefined :
            // res.status(http_code).json({status: http_code, message : this.errMessage(message) });
            res.status(http_code).json({status: http_code, message : message });
            break;
        case (typeof response === 'object'):
            // res.status(http_code).json({message : this.errMessage(message) });
            res.status(http_code).json({message : message });
            break;
        default :
            res.status(http_code).json(response);        
    }
}

exports.errMessage  =   function(error: any)
{
     return {
            "errorType" : error.name,
            "errorMessage" : error.message,
            "errorStack" : error.stack
        }
}

exports.report =  function(req: Request, res: Response, err: any, data: any)
{
    try
    {
        if(err != null) 
        {
            if(err.code == 11000)
            {
                this.send(res, err, 200, "Duplicate Error");
            }
            if(err){ this.send(res, this.errMessage(err), 500, "Application Error"); }
        } else {
            this.send(res, 'User sucessfully created', 200, data);
        }
    }catch(error){
        this.send(res, this.errMessage(error), 200, 'Internal Server Error');
    }
}

exports.truncate =  function(req: Request, res: Response, err: any, data: any)
{
    try
    {
        res.status(200).json({status: 200, message : data });
    }catch(error){
        this.send(res, this.errMessage(error), 200, 'Internal Server Error');
    }
}

export default { sendResponse }
