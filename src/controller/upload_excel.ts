// import express, { Express, Request, Response } from 'express';
// import async from 'async';
// const User = require("../model/user");
// const typeOfUser = require("../model/user_type");
// const xlsx = require('xlsx');
// const sendEmailToCandidate = require('../helper/sendemail');
// let removeFilesFromFolder = require('../helper/file');
// let rezponse =   require('../helper/response');
// // let inMemory =   require('../helper/memory');

// // const morgan = require('morgan');
// // const _ = require('lodash');
// // const excelData = require('../Helper/remove_empty_array.js');

// module.exports.saveUpload    =   function(req: any, res: any)
// {
//     const URL = req.protocol + '://' + req.get('host');    
//     const directoryUrl = URL+"public/excel_documents/";
//     const virtualUrl = URL+"static/";
//     const failToSend = [];
//     const sentSuccessfully = [];

//     async.waterfall([
//         function stepOne(callback: any)
//         {
//             //read from excel file
//             var workbook = xlsx.readFile(req.file.path);
//             var sheet_namelist: [string] = workbook.SheetNames;
//             let userMessage = req.body.message;
                
//             var x = 0;
//             let xlData;
            
//             sheet_namelist.forEach(element => {
//                 xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
//             }); 
//             callback(null, xlData) 
//             // console.log({ "workboook : " : xlData });
//         }, 
//         async function stepTwo(xlData, callback)
//         {
//             let candidateId = await typeOfUser.userType('Candidate');
//             const typeUser  = candidateId[0]['_id'];
//             // console.log(userType);
//             return [xlData, typeUser];
//         },
//         async function stepThree(xlData, typeUser)
//         {
//             //get all email
//             let emailsFromDB = "";
//             const emailsCount = await User.emailsCount();
//             if(emailsCount === 0)
//             {
//                 emailsFromDB = null;
//             } else {
//                 const candidateEmails = await User.allEmail();                
//                 emailsFromDB = candidateEmails;
//             }
//             // callback(null, xlData, userType, emailsFromDB);
//             return [xlData, typeUser, emailsFromDB, emailsCount];
//         },
//         function stepFour(xlData, typeUser, emailsFromDB, emailsCount)
//         {                                
//             // console.log({ "Step Four 4444444444444444 : " : xlData });
//             const dataInExcel = xlData[0][0];
//             const userType = xlData[0][1];
//             const mailsFromDb = xlData[2];
//             const emails = xlData[3];
//             console.log({"TOTAL NUMBER OF EMAILS" : emails});
//             if(emails < 1)
//             {
//                 console.log({"USER----TYPE" : userType});
//                 console.log({"FIRST TIME" : userType});
//                 firstTime(req, res, dataInExcel, userType);
//             } else {
//                 subsequent(req, res, dataInExcel, userType, mailsFromDb);
//                 console.log({"SECOND TIME" : mailsFromDb});
//             }
//         },
//         function stepFive(dataInExcel, userType, emailsFromDB)
//         {       
//             let firstTimeData = [];  
//             let data = {};          
//             let firstSetOfEmails = []; 
//             let firstSetOfPassword = [];

//             for(i = 0; i < xlData.length; i++)
//             {
//                 data = {};
//                 data.email = xlData[i]['email'];
//                 data.password = xlData[i]['password'];
//                 data.utype = userType._id;
//                 firstTimeData.push(data);
        
//                 firstSetOfEmails.push(xlData[i]['email']);
//                 firstSetOfPassword.push(xlData[i]['password']);
//             }
//             let inserted = User.insertManyCandidates(firstTimeData); 
//             const fileNames = [];
//             const filename = fileNames.push(req.file.filename);
//             const folder = process.cwd()+'\\public\\excel_documents';
//             removeFilesFromFolder.removeFiles(fileNames, folder);
            
//             //send emails to candidate
//             sendEmailToCandidate.sendEmails(res, firstSetOfEmails, req.body.message);
//         },
//         function stepSix(dataInExcel, userType, emailsFromDB)
//         {
//             //doing the working
//             let emailFromDb = [];

//             for(i = 0; i < emailsFromDb.length; i++)
//             {
//                 emailFromDb.push(emailsFromDb[i].email); 
//             }
            
//             let onlyNewEmails = [];
//             let onlyNewPassword = [];
//             let candidates = [];

//             for(i = 0; i < xlData.length; i++)
//             {        
//                 let emails = {};
//                 if(!emailFromDb.includes(xlData[i]['email']))
//                 {
//                     console.log(xlData[i]['email'] + " is a new email");
//                     userData = {};
//                     userData.email = xlData[i]['email'];
//                     userData.password = xlData[i]['password'];
//                     userData.utype = candydate._id;
//                     candidates.push(userData);
        
//                     onlyNewEmails.push(xlData[i]['email']);
//                     onlyNewPassword.push(xlData[i]['password']);
//                 }
//                 //  else {
//                     //     console.log(xlData[i]['email'] + " already exist");
//                     // }
//             }
//             if(onlyNewEmails.length > 0)
//             {
//                 let inserted = User.insertManyCandidates(candidates); 
//                 const fileNames = [];
//                 const filename = fileNames.push(req.file.filename);
//                 const folder = process.cwd()+'\\public\\excel_documents';
//                 removeFilesFromFolder.removeFiles(fileNames, folder);
                
//                 //send emails to candidate
//                 sendEmailToCandidate.sendEmails(res, onlyNewEmails, req.body.message);

//             }  else {
//                 let message = "All user data in excel sheet already exist";
//                 callback(null, message);
//             }
//         }
//     ], function(err, message)
//     {
//          if(err)
//          {
//             rezponse.returnResponse(res, 420, err, '');
//          } else {
//             rezponse.returnResponse(res, 200, message);
//          }
//     });
// }

// function firstTime(req, res, dataInExcel, userType)
// {       
//     let firstTimeData = [];  
//     let data = {};          
//     let firstSetOfEmails = []; 
//     let firstSetOfPassword = [];

//     // console.log({ "worksheet : " : dataInExcel });

//     for(i = 0; i < dataInExcel.length; i++)
//     {
//         data = {};
//         data.email = dataInExcel[i]['email'];
//         data.password = dataInExcel[i]['password'];
//         data.utype = userType._id;
//         firstTimeData.push(data);

//         firstSetOfEmails.push(dataInExcel[i]['email']);
//         firstSetOfPassword.push(dataInExcel[i]['password']);
//     }
//     let inserted = Users.insertManyCandidates(firstTimeData); 
//     inserted.then((result) => {
//         // console.log({ "INSERTED : " : result });
//         // console.log("++++++++++++++++++++++");
//         const fileNames = [];
//         console.log("1")
//         fileNames.push(req.file.filename);
//         console.log("2")
//         const folder = process.cwd()+'\\public\\excel_documents';
//         console.log("3")
//         removeFilesFromFolder.removeFiles(fileNames, folder);
//         console.log("4")
        
//         //send emails to candidate
//         sendEmailToCandidate.sendEmails(req, res, firstTimeData, req.body.message);
//         console.log("5");
//     }).catch((error) => {
//         console.log("Error", error);
//     })
// }

// function subsequent(req, res, dataInExcel, userType, mailsFromDb)
// {
//     //doing the working
//     let emailFromDb = [];

//     for(i = 0; i < mailsFromDb.length; i++)
//     {
//         emailFromDb.push(mailsFromDb[i].email); 
//     }
    
//     let onlyNewEmails = [];
//     let onlyNewPassword = [];
//     let candidates = [];
//     let existingEmails = [];

//     for(i = 0; i < dataInExcel.length; i++)
//     {        
//         let emails = {};
//         if(!emailFromDb.includes(dataInExcel[i]['email']))
//         {
//             console.log(dataInExcel[i]['email'] + " is a new email");
//             userData = {};
//             userData.email = dataInExcel[i]['email'];
//             userData.password = dataInExcel[i]['password'];
//             userData.utype = userType;
//             candidates.push(userData);

//             onlyNewEmails.push(dataInExcel[i]['email']);
//             onlyNewPassword.push(dataInExcel[i]['password']);
//         } else {
//             existingEmails.push(dataInExcel[i]['email']);
//         }
//         console.log(existingEmails);
//     }    
//     // inMemory.saveInMemory(res, 'existingEmail', existingEmails.toString());
//     // let getFromMemory = inMemory.fetchFromMemory(res, 'existingEmail');
//     // console.log({"GET-FROM-MEMORY => " : getFromMemory});

//     if(onlyNewEmails.length > 0)
//     {
//         let inserted = Users.insertManyCandidates(candidates);  
//         inserted.then((result) => 
//         {
//             const fileNames = [];
//             const filename = fileNames.push(req.file.filename);
//             const folder = process.cwd()+'\\public\\excel_documents';
//             removeFilesFromFolder.removeFiles(fileNames, folder);
            
//             //send emails to candidate
//             sendEmailToCandidate.sendEmails(res, res, candidates, req.body.message);
//         }).catch((error) => {
//             console.log("Error", error);
//         })

//     }  else {
//         let message = "All user data in excel sheet already exist"
//         rezponse.returnResponse(res, 200, message);
//     }
// }





