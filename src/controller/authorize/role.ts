import express, { Express, Request, Response } from 'express';
import async from 'async';
const Roles          =   require("../../model/role");
const User          =   require("../../model/user");
const privilege     =   require("../../model/privilege");
const responze      =   require("../../helper/response");
 
const roles = {
    
    allRoles : (req : Request, res : Response) =>
    {
        async.waterfall([            
            async function(callback: any)
            {
                return await Roles.countRoles();
            },
            async function(callback: any)
            {
                return await Roles.allRoles();
            }
        ], function(err: any, allRoles: any)
        {
            if(err === true || allRoles === true)    
            {
                let errMessage = `No role found`;
                responze.truncate(req, res, err, errMessage);
            } else {
                responze.report(req, res, err, allRoles);
            }
        });
    },
    addRole : (req : Request, res : Response) =>
    {
        let data = req.body;
        async.waterfall([
            async function(callback: any)
            {             
                return Roles.checkIfRoleExist(data.name);
            }, 
            function(doesRoleExist: any, callback: any)
            {  
                if(doesRoleExist === 0)
                {
                    let newRole = new Roles();
                    newRole.name = data.name;
                    newRole.abbr = data.abbr;
                    newRole.description = data.description;
                    newRole.save();
                    callback(null, newRole); 
                }  else {
                    callback(true)
                }
            }
        ], function(err: any, newRole: any)
        {
            if(err === true)    
            {
                let errMessage = `Privilege with (NAME : ${data.name}) already exist`;
                responze.truncate(req, res, err, errMessage);
            } else {
                responze.report(req, res, err, newRole);
            }
        })
    }, 
    updateRole : (req : Request, res : Response) => 
    {
        let data = req.body;
        async.waterfall([
            async function(callback: any)
            {
                return await Roles.doesRoleExist(data.role_id);
            }, 
            function(doesRoleExist: any, callback: any)
            {
                if(doesRoleExist != 0)
                {                    
                    Roles.
                    findOneAndUpdate(
                        { "_id": data.role_id }, 
                        { "$set": { "name": data.name, "abbr": data.abbr, "description": data.description } })
                    .exec((err: any, update: any) =>
                    {
                        callback(null, update);
                    })
                } else {
                    callback(true);
                }
            }, 
            function(update: any, callback: any)
            {
                Roles.findById({ "_id": data.role_id }, 
                function(err: any, role: any)
                {
                    callback(null, role);
                });
            }
        ], function(err: any, role: any)
        {
            if(err === true)    
            {
                let errMessage = `Role to update not found`;
                responze.truncate(req, res, err, errMessage);
            } else {
                responze.report(req, res, err, role);
            }
        });
    },
    deleteRole : (req : Request, res : Response) => 
    {
        let data = req.params.role_id;
        async.waterfall([
            function(callback: any)
            {
                Roles.
                findOne({ "_id" : data}, (err: any, role: any) =>
                {
                    callback(null, role);
                })
            }, function(role: any, callback: any)
            {
                Roles.
                findByIdAndRemove({ "_id" : data}, (err: any, response: any) =>
                {
                    callback(null, role);
                })
            }
        ], function(err, role)
        {
            responze.report(req, res, err, role);
        });
    },
    findRole : (req : Request, res : Response)  => 
    {
        let data = req.params.role_id;
        async.waterfall([
            function(callback: any)
            {
                Roles.
                findOne({ "_id" : data}, (err: any, role: any) =>
                {
                    if(role === null)
                    {
                        callback(true);
                    } else {
                        callback(null, role);
                    }
                })
            }
        ], function(err: any, role: any)
        {
            if(err === true)    
            {
                let errMessage = `Role not found`;
                responze.truncate(req, res, err, errMessage);
            } else {
                responze.report(req, res, err, role);
            }
        });
    },
    searchRole : (req : Request, res : Response) => 
    {

    }

}

module.exports.roles  =  roles;
