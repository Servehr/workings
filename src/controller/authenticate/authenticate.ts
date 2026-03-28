require("dotenv").config();
import express, { Express, Request, Response } from 'express';
import async from 'async';
import bcrypt from 'bcrypt';
const User          =   require("../../model/user");
const Reset         =   require("../../model/reset");
const jwt           =   require("../../helper/token");
const responze      =   require("../../helper/response");
const mailToUser    =   require('../../helper/sendemail');
const random        =   require('../../helper/random');
const saltRounds    =   10;
import {IRegister} from '../../interface/IRegister';

const authentication = {

    loginUser : (req : Request, res : Response) => 
    {
        let error: boolean = false;
        let errMsg: string;
        let statusCode : number;

        async.waterfall([
            async function(callback: any)
            {
                let data: any = req.body;
                let user: any = await User.findUser(data.email);
                if(user.length === 1)
                {  
                    let isPasswordSame = await bcrypt.compare(data.password, user[0].password)
                    if(isPasswordSame === true)
                    {                                               
                        
                        let priviledge = ["Create", "Read", "Write", "Delete"]
                        let userToken = { id: user[0]._id, email: user[0].email }
                        user[0].token = jwt.userSignature.token(userToken);
                        user[0].roles = { position: "Manager", priviledge: priviledge }
                        // const { password, ...userInfo } = userData.user;
                        user[0].password = '';
                        statusCode = 200;
                        return user[0];
                    }  else {
                        error = true;
                        errMsg = "Invalid username or password";
                        statusCode = 400;
                        callback(true)
                    }
                } else {
                    error = true;
                    errMsg = "Invalid username or password";
                    statusCode = 401;
                    callback(true)
                }
            },
        ], function(err: any, user: any)
        {
            try 
            {   
                // if(err)
                // {
                //     responze.send(res, errMsg, statusCode, '');
                // } else {              
                //     let maxAge: number = 1 * 24 * 60 * 60;
                //     res.cookie('bctSmootheRide', user.userToken, { httpOnly : true, maxAage : maxAge * 1000 });
                //     responze.send(res, 'Login Successful', statusCode, user);
                // }
            } catch (error) {
                // responze.send(res, error, statusCode, "");
            }
        })        
    },
    signUp : (req : Request, res : Response) => 
    {
        let error: boolean = false;
        let errMsg: string = '';
        let data: IRegister = req.body;
        let statusCode: number;

        async.waterfall([
            async function(callback: any)
            {
                let emailExist = await User.whereMailMatch(data.email);
                callback(null, emailExist);
            },
            async function(emailExist: any, callback: any)
            {
                if(emailExist === 0)
                {
                    const hashPwd = await bcrypt.hash(data.password, saltRounds);
                    let user = new User();
                    user.firstname = data.firstname;
                    user.surname = data.surname;
                    user.phone = data.phone;
                    user.email = data.email;
                    user.password = hashPwd;
                    user.save();
                    callback(null, user);
                }  else {
                    error = true;
                    errMsg = "Account with credential already exist";
                    statusCode = 200;
                    callback(true)
                }
            }
        ], function(err: any, user: any) {
            try 
            {   
                responze.send(res, 'Registration Successful', 200, user);
                if(err)
                {   
                    responze.truncate(res, errMsg, statusCode, '');
                } else {
                    if(mailToUser.sendMail(req, res, user))
                    {
                        responze.send(res, 'Registration Successful', 200, user);
                    } else {
                        responze.send(res, 'Registration Successful, Sending activation link failed', 200, user);
                    }
                    
                }
            } catch (error) {
                responze.send(res, "Error Encountered", 500, error);
            }
        })
    },
    forgot : (req : Request, res : Response) => 
    {
        let error = false;
        let errMsg: string;
        let data = req.body;
        let statusCode: number;

        async.waterfall([
            async function(callback: any)
            {
                let emailExist = await User.whereMailMatch(data.email);
                if(emailExist === 1)
                {
                    return await User.selectAll(data.email);
                } else {
                    error = true;
                    errMsg = "No match found";
                    statusCode = 200;
                    callback(true)
                }
            },
            async function(user: any, callback: any)
            {
                const randormCharacters = random.character();
                const url = `${process.env.url}/reset-password`;
                user[0].push(randormCharacters);
                user[0].push(url);
                let sendLinkToUser = mailToUser.sendMail(req, res, user[0]);
                if(sendLinkToUser)
                {
                    let reset = new Reset();
                    reset.userId = user[0]._id;
                    reset.code   = randormCharacters;
                    reset.save();
                    return user[0];
                } else {
                    error = true;
                    errMsg = "Forgot password link couldn`t be sent. Please, retry again";
                    statusCode = 200;
                    callback(true)
                }
            }
        ], function(err: any, data: any){
            try 
            {   
                if(err)
                {
                    responze.send(res, errMsg, statusCode, '');
                } else {              
                    let message = 'Email successfully sent. Check your mail for link to reset your password';
                    responze.send(res, message, 200, data);
                }
            } catch (error) {
                responze.send(res, "An unknown error occurred", 500, '');
            }
        })
    },
    reset : (req : Request, res : Response) => 
    {
        let data: any = req.body;
        let userId: string = data.id;
        let code: number = data.code;
        let error: boolean;
        let errMsg: string;
        let statusCode: number;

        async.waterfall([
            async function(callback: any)
            {
                let validateUser = await User.resetData(userId);
                if(validateUser[0].code === code && validateUser[0]._id === userId)
                {
                    return;
                } else {
                    error = true;
                    errMsg = "Account with credential already exist";
                    statusCode = 200;
                    callback(true)
                }
            },
            async function(data: any, callback: any)
            {
                let doesDataExist = await User.doesExist(userId);
                if(doesDataExist === 0)
                {
                    return;
                } else {
                    error = true;
                    errMsg = "An unexpected error occured, resetting data not completed";
                    statusCode = 200;
                    callback(true)
                }
            }
        ], function(err, data)
        {
            try 
            {   
                if(err)
                {
                    responze.send(res, errMsg, statusCode, '');
                } else {              
                    let redirectTo = `${process.env.url}/change`;
                    let message = 'Password successfully changed';
                    responze.send(res, message, 200, redirectTo);
                }                
            } catch (error) {
                responze.send(res, error, 500, '');                
            }
        })
    },
    resendActivationLink : (req : Request, res : Response) => 
    {
        // this.forgot();
    },
    change : (req : Request, res : Response) => 
    {
        let data: any = req.body;
        let userId: string = data.id;
        let password: any = data.password;
        let error: boolean;
        let errMsg: string;
        let statusCode: number;

        async.waterfall([
            async function(callback: any)
            {
                let user: any = await User.findUser(userId);
                if(user)
                {
                    user.password = password;
                    user.save();
                    //user interface to remove data
                    user.password = '';
                    return user;
                } else 
                {
                    error = true;
                    errMsg = "User not found";
                    statusCode = 200;
                    callback(true)
                }
            }
        ], function(err, data){
            try 
            {   
                if(err)
                {
                    responze.send(res, errMsg, statusCode, '');
                } else {              
                    let message = 'Password successfully changed';
                    responze.send(res, message, 200, data);
                }                
            } catch (error) {
                responze.send(res, error, 500, '');                
            }
        })
    },
    logout : (req : Request, res : Response) =>
    {    
        try 
        {
            // let maxAage: number;
            // res.cookie('bctSmootheRide', '', { maxAage : 1 });  
            // res.clearCookie('bctSmootheRide');
            // res.json( 
            //     { 
            //         status : 200, 
            //         msg : "Successfully logged out", 
            //         redirectTo : `${process.env.url}` 
            //     } 
        // );    
        } catch (error) {
            // responze.send(res, error, 500, '');             
        }
    },
    deleteUser : (req : Request, res : Response) => 
    {
        let userId = req.params.id;
        let error: boolean;
        let errMsg: string;
        let statusCode: number;

        async.waterfall([
            async function(callback: any)
            {
                let user = await User.selectRowById(userId);
                if(user)
                {             
                    await User.findByIdAndDelete({ _id: user[0]._id });
                    return user;
                } else 
                {
                    error = true;
                    errMsg = "User not found";
                    statusCode = 200;
                    callback(true)
                }
            },
            async function(user: any, callback: any)
            {
                let userExist = await User.doesUserExist(userId);
                if(userExist === 0)
                {
                    return user;
                } else 
                {
                    error = true;
                    errMsg = "Deleting user failed";
                    statusCode = 200;
                    callback(true)
                }
            }
        ], function(err: any, user: any){
            try 
            {   
                if(err)
                {
                    responze.send(res, err, statusCode, '');
                } else {              
                    let message = `${user[0].firstname} ${user[0].surname} successfully deleted`;
                    responze.send(res, message, 200, '');
                }                
            } catch (error) {
                responze.send(res, error, 500, '');                
            }
        })
    }
    
}

exports.authentication = authentication;









