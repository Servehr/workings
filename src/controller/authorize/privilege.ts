import express, { Express, Request, Response } from 'express';
import async from 'async';
const role          =   require("../../model/role");
const User          =   require("../../model/user");
const Privileges    =   require("../../model/privilege");
const responze      =   require("../../helper/response");
 
const privilege = {
    
    allPrivileges : (req : Request, res : Response) =>
    {
        async.waterfall([
            async function(callback: any)
            {
                return await Privileges.countPrivilege();
            },
            async function(totalPrivilege: any, callback: any)
            {
                if(totalPrivilege > 0)
                {
                    return await Privileges.allPrivileges();
                } else {
                    return true;
                }
            },
        ], function(err: any, allPrivileges: any)
        {
            if(err === true || allPrivileges === true)    
            {
                let errMessage = `No privilege found`;
                responze.truncate(req, res, err, errMessage);
            } else {
                responze.report(req, res, err, allPrivileges);
            }
        });
    },
    addPrivilege : (req : Request, res : Response) =>
    {
        let data = req.body;
        async.waterfall([
            async function(callback: any)
            {             
                return Privileges.checkIfPrivilegeExist(data.name);
            }, 
            function(doesPrivilegeExist: any, callback: any)
            {  
                if(doesPrivilegeExist === 0)
                {
                    let newPrivilege = new Privileges();
                    newPrivilege.name = data.name;
                    newPrivilege.abbr = data.abbr;
                    newPrivilege.description = data.description;
                    newPrivilege.save();
                    callback(null, newPrivilege); 
                }  else {
                    callback(true)
                }
            }
        ], function(err: any, newPrivilege: any)
        {
            if(err === true)    
            {
                let errMessage = `Privilege with (NAME : ${data.name}) already exist`;
                responze.truncate(req, res, err, errMessage);
            } else {
                responze.report(req, res, err, newPrivilege);
            }
        })
    }, 
    updatePrivilege : (req : Request, res : Response) => 
    {
        let data = req.body;
        async.waterfall([            
            async function(callback: any)
            {
                return await Privileges.allRoles();
            }, 
            function(doesPrivilegeExist: any, callback: any)
            {
                if(doesPrivilegeExist !== 0)
                {                    
                    Privileges.
                    findOneAndUpdate(
                        { "_id": data.privilege_id }, 
                        { "$set": { "name": data.name, "abbr": data.abbr, "description": data.description } })
                    .exec((err: any, update: any) =>
                    {
                        callback(null, update);
                    })
                } else {
                    callback(true);
                }                
            }, function(update: any, callback: any)
            {
                Privileges.findById({ "_id": data.privilege_id }, 
                function(err: any, priviledge: any)
                {
                    callback(null, priviledge);
                });
            }
        ], function(err: any, priviledge: any)
        {
            if(err === true)    
            {
                let errMessage = `Privilege with (NAME : ${data.name}) already exist`;
                responze.truncate(req, res, err, errMessage);
            } else {
                responze.report(req, res, err, priviledge);
            }
        });
    },
    deletePrivileges : (req : Request, res : Response) => 
    {
        let data = req.params.id;
        async.waterfall([
            function(callback: any)
            {
                Privileges.
                findOne({ "_id" : data}, (err: any, priviledge: any) =>
                {
                    callback(null, priviledge);
                })
            }, function(priviledge: any, callback: any)
            {
                Privileges.
                findByIdAndRemove({ "_id" : data}, (err: any, response: any) =>
                {
                    callback(null, priviledge);
                })
            }
        ], function(err, priviledge)
        {
            responze.report(req, res, err, priviledge);
        });
    },
    findPrivilege : (req : Request, res : Response)  => 
    {
        let data = req.params.id;
        async.waterfall([
            function(callback: any)
            {
                Privileges.
                findOne({ "_id" : data}, (err: any, priviledge: any) =>
                {
                    if(priviledge === null)
                    {
                        callback(true);
                    } else {
                        callback(null, priviledge);
                    }
                })
            }
        ], function(err: any, priviledge: any)
        {
            if(err === true)    
            {
                let errMessage = `Privilege not found`;
                responze.truncate(req, res, err, errMessage);
            } else {
                responze.report(req, res, err, priviledge);
            }
        });
    }
}

module.exports.privilege  =  privilege;
