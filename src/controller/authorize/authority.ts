// import express, { Express, Request, Response } from 'express';
// import async from 'async';
// import bcrypt from 'bcrypt';
// const saltRounds: number = 10;
// const Roles        =   require("../../model/role.js");
// const User         =   require("../../model/user.js");
// const Privileges   =   require("../../model/privilege.js");
// const responze     =   require("../../helper/response.js");
 
// const authorize = {
   
//     userPriviledge : (req : Request, res : Response) => 
//     {
//         return; 
//     },   
//     swapRoles : (req : Request, res : Response) => 
//     {
//         return; 
//     }, 
//     attachPriviledge : (req : Request, res : Response) =>
//     {
//         let data = req.body;
//         async.waterfall([
//             function(callback: any)
//             {
//                 Roles.
//                 findOne(
//                 { _id : data.role_id }, (err: any, roles: any) =>
//                 {
//                     callback(null, roles)
//                 })
//             }, 
//             function(roles: any, callback: any) 
//             {
//                 let listOfPrivilegesToRemove = [];
//                 listOfPrivilegesToRemove = roles.privilege_id;
//                 let position;
//                 if(!listOfPrivilegesToRemove.includes(data.privilege_id))
//                 {  
//                     Roles
//                     .findOneAndUpdate(
//                         { _id: data.role_id },
//                         { $push: { privilege_id: data.privilege_id } }, (err: any, privilegeAttached: any)  =>
//                         {
//                             callback(null, privilegeAttached);
//                         }
//                     )
//                 } else {
//                     callback(true);
//                 }
//             }, 
//             function(privilegeAttached: any, callback: any) 
//             {
//                 Roles
//                 .findOne(
//                     { "_id" : data.role_id}, (err: any, attachedPrivilege: any) =>
//                     {
//                         callback(null, attachedPrivilege)
//                     }
//                 )
                
//             }
//         ], function(err: any, attachedPrivilege: any)
//         {
//             if(err === true)    
//             {
//                 let errMessage = `Privilege already attached to role`;
//                 responze.truncate(req, res, err, errMessage);
//             } else {
//                 responze.report(req, res, err, attachedPrivilege);
//             }
//         });
//     },
//     detachPriviledge : (req : Request, res : Response) =>
//     {
//         let data = req.body;
//         let privileges: [] = data.privilege_id;
//         let message: any = [];
//         let builder: any = {};
//         let errMessage: string;
//         async.waterfall([
//             function(callback: any)
//             {
//                 Roles.
//                 findOne(
//                     { _id : data.role_id }, (err: any, role: any) =>
//                     {
//                         if(role === null)
//                         {
//                             errMessage = "Role not found";
//                             callback(true);
//                         } else {
//                             callback(null, role);
//                         }
//                     }
//                 )
//             },
//             function(role: any, callback: any)
//             {
//                 let privilegeUnderRole = role.privilege_id
//                 let incomingPrivileges: []  = [];
//                 let invalidPermission: []  = [];

//                 if(privilegeUnderRole.length > 0)
//                 {
//                     privileges.forEach(function(prm: any, index: number)
//                     {
//                         if(!privilegeUnderRole.includes(privileges[index]))
//                         {
//                             invalidPermission.push(privileges[index]);
//                         }
//                     });
//                     if(invalidPermission.length > 0)
//                     {
//                         builder.invalid = "The following privilege parameter passed invalid";
//                         builder.invalidParameters = invalidPermission;
//                         message.push(builder);
//                         callback(true);
//                     } else {
//                         callback(null, privilegeUnderRole, role);
//                     }
//                 } else {
//                     let empty = '';
//                     callback(null, empty, empty);
//                 }
//             },
//             async function(privilegeUnderRole: any, role: any, callback: any)
//             {
//                 if(privilegeUnderRole != '')
//                 {
//                     let isAttached: [] = [];
//                     let isAttachedName: [] = [];
//                     let isNotAttached: [] = [];
//                     let isNotAttachedName = [];
//                     for(let i = 0; i < privileges.length; i++)
//                     {
//                         if(privilegeUnderRole.includes(privileges[i]))
//                         {
//                             isAttached.push(privileges[i]);
//                             let privilegeName = await Privileges.getPrivilegeName(privileges[i]);
//                             isAttachedName.push(privilegeName[0].description);
//                         } else {    
//                             isNotAttached.push(privileges[i]);
//                             let privilegeName = await Privileges.getPrivilegeName(privileges[i]);
//                             isNotAttachedName.push(privilegeName[0].description);
//                         }
//                     };
//                     console.log(isAttached);
//                     callback(null, isAttached, isAttachedName, isNotAttached, isNotAttachedName, privilegeUnderRole, role);
//                 } else {
//                     callback('', '', '', '', '', '');
//                 }
//             },
//             function(isAttached: any, isAttachedName: any, isNotAttached: any, isNotAttachedName: any, privilegeUnderRole: any, role: any, callback: any)
//             {
//                 // let isAlreadyAttachedName = [];
//                 // let isAlreadyAttachedId = [];
//                 // for(let i = 0; i < isAttached.length; i++)
//                 // {

//                 // }
//                 if(isAttached.length > 0)
//                 {
//                     builder.attached = "The following privilege already attached";
//                     builder.alreadyAttached = isAttached;
//                     builder.alreadyAttachedName = isAttachedName;
//                     message.push(builder);
//                     callback(true);
//                 }

//             },
//             function(privilegeUnderRole: any, role: any, callback: any)
//             {
//                 Privileges
//                 .findOne(
//                     { _id : data.privilege_id }, (err: any, privilege: any) =>
//                     {
//                         if(privilege === null)
//                         {
//                             errMessage = "Privilege not found";
//                             callback(true);
//                         } else {
//                             callback(null, role, privilege);
//                         }
//                     }
//                 )
//             },
//             function(role: any, privilege: any, callback: any)
//             {
//                 let listOfPrivilegesToRemove = [];
//                 listOfPrivilegesToRemove = role.privilege_id;
//                 let positionToRemove = [];

//                 let privilegeName = privilege.name; 
//                 for(let i = 0; i < data.privilege_id.length; i++)
//                 {
//                     if(listOfPrivilegesToRemove.includes(data.privilege_id[i]))
//                     {
//                         positionToRemove.push(listOfPrivilegesToRemove.indexOf(data.privilege_id));
//                         Roles
//                         .findOneAndUpdate( 
//                             { "_id" : data.role_id }, 
//                             { $pull : { "privilege_id" : data.privilege_id } }, (err: any, removedPrivilege: any) =>
//                             {
//                                 if(err)
//                                 {
//                                     message.push(`Detaching ${role.name} with id ${role._id} failed`);
//                                     callback(true);
//                                 } else {
//                                     message.push(privilegeName + " succesfully detached from " + role.name);
//                                     callback(null, removedPrivilege);
//                                 }
//                         })
//                     } else {
//                         message.push(`${role.name} with [id => ${role._id}] has no privilege to detach/remove`);
//                     }
//                 }  
//             }
//         ], function(err: any, removedPrivilege: any)
//         {
//             if(err)    
//             {
//                 responze.truncate(req, res, err, message);
//             } else {
//                 responze.report(req, res, err, removedPrivilege);
//             }
//         });
//     },
//     grantRoles : (req : Request, res : Response) => 
//     {
//         let data: any = req.body;
//         async.waterfall([
//             function(callback: any)
//             {
//                 Roles.
//                 findOne(
//                     { "_id" : data.role_id }, (err: any, role: any) =>
//                     {
//                         callback(null, role);
//                     }
//                 )
//             }, function(role: any, callback: any)
//             {
//                 let listOfPrivilegesToAdd: any = [];
//                 listOfPrivilegesToAdd = role.privilege_id;
//                 let position = [];

//                 let privilegeAlreadyExist = [];
//                 for(let i: number = 0; i < data.privilege_id.length; i++)
//                 {
//                     if(listOfPrivilegesToAdd.includes(data.privilege_id[i]))
//                     {
//                         privilegeAlreadyExist.push(data.privilege_id[i]);
//                     }
//                 }
//                 if(privilegeAlreadyExist.length == 1)
//                 {
//                     let err = [privilegeAlreadyExist, "Privileges already attached to xxxx"];
//                     //pass it as it is true
//                     callback(true);
//                 } else if(privilegeAlreadyExist.length > 1)
//                 {
//                     let err = [privilegeAlreadyExist, "One or more of the privileges already attached to xxxx"];
//                     //pass it as it is true
//                     // cb(err);
//                 } else {
//                     Roles
//                     .findOneAndUpdate(
//                         { _id: data.role_id },
//                         { $push: 
//                             { privilege_id: data.privilege_id } 
//                         }, (err: any, updatedRole: any)  =>
//                         {
//                             callback(null, updatedRole);
//                         })
//                 }
//             }, function(updatedRole: any, callback: any)
//             {
//                 Roles
//                 .findOne(
//                     { "_id" : data.role_id}, 
//                     (err: any, roles: any) =>
//                 {
//                     callback(null, roles);
//                 })
//             }
//         ], function(err, roles)
//         {
//         });
//     },
//     revokeRoles : (req : Request, res : Response) => 
//     {
//         let data: any = req.body;
//         let privilegeToRemove: any = [];
//         async.waterfall([
//             async function(callback: any)
//             {
//                 let privilegeToRemove: [] = [];
//                 for(let i: number = 0; i < data.privilege_id.length; i++)
//                 {
//                     privilegeToRemove.push(data.privilege_id[i]);
//                 }                
//                 return await Roles.findRole(data.role_id);
//             },
//             function(roles: any, callback: any)
//             {
//                 Roles           
//                 .updateMany( { "_id" : data.role_id }, 
//                 { $pull : { privilege_id: { $in: privilegeToRemove } } }, 
//                 (err: any, detachedRoles: any) =>
//                 {
//                     callback(null, detachedRoles);
//                 })
//             }
//         ], function(err, detachedRoles)
//         {
//             // try
//             // {
//             //     if(err) 
//             //     {
//             //         sendResponse
//             //         .response(res, err, 200,
//             //                  'https://openmind/login');
//             //     } else {
//             //         switch(data)
//             //         {
//             //             case null : 
//             //             case "" : 
//             //             case undefined : 
//             //                 sendResponse
//             //                 .response(res, 
//             //                         'Error Encountered', 
//             //                         200, '');
//             //                 break;
//             //             case data.modifiedCount == 1 :
//             //                 sendResponse
//             //                 .response(res, detachedRoles, 200, '');
//             //             default:
//             //                 sendResponse
//             //                 .response(res, 
//             //                         'Allowing user privilege failed',
//             //                         200, '');
//             //                 break;                                    
//             //         }
//             //         responze.send(res, 'User sucessfully created', 200, 'Ok');
//             //     }
//             // } catch(error)
//             // {
//             //     responze.send(res, error, 200, 'Error');
//             // }
//         });
//     },
//     restrictUser : (req : Request, res : Response) => 
//     {
//         let data: any = req.body;
//         async.waterfall([
//             function(callback: any)
//             {
//                 Privileges.
//                 findOne({ "_id" : data.privilege_id }, (err: any, priviledge: any) =>
//                 {
//                     callback(null, priviledge);
//                 })
//             }, 
//             function(priviledge: any, callback: any)
//             {
//                 Privileges
//                 .updateOne( { "_id" : data.privilege_id }, 
//                   { $push: { control : data.privilege_id } }, (err: any, updatedPrivilege: any) =>
//                   {
//                      callback(null, updatedPrivilege);
//                   })
//             }
//         ], function(err, updatedPrivilege)
//         {
//             //  try
//             //  {
//             //     if(err)
//             //     {
//             //         sendResponse
//             //         .response(res, err, 200,
//             //         'https://openmind/login');
//             //     } else {
//             //         switch(data)
//             //         {
//             //             case null : 
//             //             case "" : 
//             //             case undefined : 
//             //                 sendResponse
//             //                 .response(res, 
//             //                            'Error Encountered', 
//             //                            200, '');
//             //                 break;
//             //             case data.modifiedCount == 1 :
//             //                 sendResponse
//             //                 .response(res, updatedPrivilege, 200, '');
//             //             default:
//             //                 sendResponse
//             //                 .response(res, 
//             //                          'Restricting user action failed',
//             //                          200, '');
//             //                 break;                                    
//             //         }
//             //     }
//             //  }catch(error){
//             //     responze.send(res, responze.send(error), 500, 'Error');
//             //  }
//         });
//     },
//     attachRight : (req : Request, res : Response) => 
//     {
//         let data: any = req.body;
//         async.waterfall([
//             function(callback: any)
//             {
//                 Privileges.
//                 findOne({ "_id" : data.role_id }, (err: any, priviledgeData: any) =>
//                 {
//                     callback(null, priviledgeData);
//                 })
//             },
//             function(priviledgeData: any, callback: any)
//             {
//                 Privileges
//                 .updateOne( { "_id" : data.role_id }, 
//                 { $pull : { control : data.privilege_id } }, (err: any, updatedPrivilegeData: any) =>
//                 {
//                     callback(null, updatedPrivilegeData)
//                 }
//                 )
//             }
//         ], function(err, updatedPrivilegeData)
//         {
//             // try
//             // {
//             //     if(err) 
//             //     {
//             //         sendResponse
//             //         .response(res, err, 200,
//             //                  'https://openmind/login');
//             //     } else {
//             //         switch(data)
//             //         {
//             //             case null : 
//             //             case "" : 
//             //             case undefined : 
//             //                 sendResponse
//             //                 .response(res, 
//             //                         'Error Encountered', 
//             //                         200, '');
//             //                 break;
//             //             case data.modifiedCount == 1 :
//             //                 sendResponse
//             //                 .response(res, updatedPrivilegeData, 200, '');
//             //             default:
//             //                 sendResponse
//             //                 .response(res, 
//             //                         'Allowing user privilege failed',
//             //                         200, '');
//             //                 break;                                    
//             //         }
//             //         responze.send(res, 'User sucessfully created', 200, 'Ok');
//             //     }
//             // } catch(error)
//             // {
//             //     responze.send(res, error, 200, 'Error');
//             // }
//         })
//     },  
//     populate : (req : Request, res : Response) => 
//     {
//         let data: any = req.body;
//         async.waterfall([
//             function(callback: any)
//             {
//                 let newUser =   new User(
//                     {
//                         firstname : data.firstname, 
//                         surname : data.surname, 
//                         email : data.email,         
//                         tel : data.tel, 
//                         password : bcrypt.hashSync(data.password, saltRounds)
//                     }
//                 );
//                 newUser.save(function(err: any, newUser: any) 
//                 {
//                     callback(null, newUser);
//                 })
//             }, function(newUser: any, callback: any)
//             {
//                 let role  = new Roles(
//                     {
//                         name : data.name, 
//                         description : data.description, 
//                         user_id : newUser._id
//                     }
//                 );
//                 role.save((err: any, newRole: any)  =>
//                 {
//                     let newUserRole = newUser;
//                     callback(null, newUserRole);
//                 })
//             }
//         ], function(err, newUserRole)
//         {

//         });     
//     },
//     onlyRoles : async (req : Request, res : Response) =>
//     {
//         try 
//         {   
//             let getAll = '';
//             // getAll = await role.findOne();
//             // cb(null, getAll);
//         } catch (error) {
//             // cb(error);
//         }
//     },
//     rolesWithPrivileges : (req : Request, res : Response) => 
//     {
//         let role_id = req.params.role_id;
//         async.waterfall([
//             function(callback: any)
//             {
//                 Roles
//                 .findOne({ _id: role_id })
//                 .populate('privilege_id')
//                 .exec(function(err: any, rolesWithPrivileges: any)
//                 {
//                     callback(null, rolesWithPrivileges);
//                 });                 
//             }
//         ], function(err, rolesWithPrivileges)
//         {
//             if(err)    
//             {
//                 let errMessage = `Privilege not found`;
//                 responze.truncate(req, res, err, errMessage);
//             } else {
//                 responze.report(req, res, err, rolesWithPrivileges);
//             }
//         });
//     }
// }

// module.exports.authorize  =  authorize;
