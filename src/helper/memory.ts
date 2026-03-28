// const redis = require('redis')
// const client = redis.createClient()
// client.connect(); 
// let rezponse = require("./response");

// module.exports.saveInMemory   =  async function(res, holder, data)
// {
//     try 
//     {
//         await client.set(holder, data); 
//         return;

//     } catch (error) {
//         console.log(error);
//         rezponse.returnResponse(res, statusCode = 500, error.name, error.stack);
//     }
// }

// module.exports.fetchFromMemory   =  function(res, holder)
// {
//     try 
//     {
//         promise = new Promise( async function(resolve, reject)
//         {
//             let dataInMemory = await client.get(holder);
//             resolve(dataInMemory);
//         });
//         promise.then(
//             (result) => {
//                 console.log(result);
//             }, 
//             (error) => {
//                 console.log(error);
//             })

//     } catch (error) {
//         console.log(error);
//         rezponse.returnResponse(res, statusCode = 500, error.name, error.stack);
//     }
// }

// module.exports.saveMultipleRecordInMemory   =  async function(res, holder, key, data)
// {
//     try 
//     {      
//         return await client.hSet(holder, key, data.toString());

//     } catch (error) {
//         console.log(error);
//         rezponse.returnResponse(res, statusCode = 500, error.name, error.stack);
//     }
// }

// module.exports.retrieveMultipleRecordInMemory   =  async function(res, holder)
// {
//     try 
//     {       
//         return await client.hGetAll(holder);
//     } catch (error) {
//         console.log(error);
//         rezponse.returnResponse(res, statusCode = 500, error.name, error.stack);
//     }
// }