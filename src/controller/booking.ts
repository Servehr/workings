require("dotenv").config();
import express, { Express, Request, Response } from 'express';
import async from 'async';
const User          =   require("../model/user");
const Book          =   require("../model/booking");
const responze      =   require("../helper/response");
const mailToUser    =   require('../helper/sendemail');
const random        =   require('../helper/random');

const booking = {

    allBookings : (req : Request, res : Response) => 
    {        
        let error: boolean;
        let errMsg: string;
        let statusCode: number;

        async.waterfall([
            async function(callback: any)
            {
                let all_bookings = await Book.allBookings();
                if(all_bookings.length > 0)
                {
                    statusCode = 200;
                    return all_bookings;
                } else {
                   error = true;
                   errMsg = "No booking on list";
                   statusCode = 200;
                   callback(true)
                }
            }
        ], function(err: any, books: any)
        {
            try 
            {
                if(err)
                {
                    responze.send(res, errMsg, statusCode, '');
                } else {         
                    responze.send(res, errMsg, statusCode, books);
                }
            } catch (error) {
                responze.send(res, error, statusCode, "");
            }            
        })        
    },
    allUserBookings : (req : Request, res : Response) => 
    {
        let error = false;
        let errMsg;
        let data = req.body;
        let statusCode;

        async.waterfall([
            async function(callback: any)
            {
                
            }
        ], function(err: any, user: any) {
            
        })
    },
    userBooking : (req : Request, res : Response) => 
    {
        let error = false;
        let errMsg;
        let data = req.body;
        let statusCode;

        async.waterfall([
            async function(callback: any)
            {
                
            }
        ], function(err: any, data: any){

        })
    },
    cancel : (req : Request, res : Response) => 
    {
        let data = req.body;
        let userId = data.id;
        let code = data.code;

        async.waterfall([
            async function(callback: any)
            {

            }
        ], function(err, data)
        {
        })
    },
    updateBook : (req : Request, res : Response) => 
    {
        let data = req.body;
        let error: boolean = false;
        let errMsg: string;
        let statusCode: number;

        async.waterfall([
            async function(callback: any)
            {                
                let bookings = await Book.findOneAndUpdate(
                    { "_id" : data._id },
                    { $set: 
                        { 
                            "firstname": data.firstname, "surname": data.surname, "vehicleType": data.vehicleType,
                            "tripType": data.tripType, "fromLocation": data.fromLocation, "toLocation": data.toLocation,
                            "amount": data.amount  
                        }
                    }
                );
                if(bookings)
                {
                    statusCode = 200;
                    return bookings;
                } else {
                    errMsg = "Updating document failed";
                    statusCode = 200;
                    callback(true)
                }
            }
        ], function(err: any, bookings: any)
        {
            try 
            {   
                if(err)
                {
                    responze.send(res, errMsg, statusCode, '');
                } else {              
                    responze.send(res, '', statusCode, bookings);
                }
            } catch (error) {
                responze.send(res, error, statusCode, "");
            }            
        })
    },
    book : (req : Request, res : Response) => 
    {
        let data = req.body;
        let error: boolean = false;
        let errMsg: string;
        let statusCode: number;

        async.waterfall([
            function(callback: any)
            {                
                let bookings = new Book();
                bookings.firstname    = data.firstname;
                bookings.surname      = data.surname;
                bookings.vehicleType  = data.vehicleType;
                bookings.fromLocation = data.fromLocation;
                bookings.toLocation   = data.toLocation;
                bookings.tripType     = data.tripType;
                bookings.amount       = data.amount;
                bookings.save();
                statusCode = 200;
                callback(null, bookings);
            }
        ], function(err: any, bookings: any)
        {
            try 
            {   
                if(err)
                {
                    errMsg = err
                    responze.send(res, errMsg, statusCode, '');
                } else {              
                    responze.send(res, '', statusCode, bookings);
                }
            } catch (error) {
                responze.send(res, error, statusCode, "");
            }            
        })
    },
    removeBookings : (req : Request, res : Response) => 
    {
        let data = req.body;
        let userId = data.id;
        let password = data.password;

        async.waterfall([
            async function(callback: any)
            {

            }
        ], function(err: any, data: any){
            
        })
    },
    removeBooking : (req : Request, res : Response) =>
    { 
        let error: boolean = false;
        let errMsg: string;
        let statusCode: number;
        let id = req.params.id;

        async.waterfall([
            async function(callback: any)
            {
                let booking: any = await Book.findByIdAndDelete(id)
                if(booking)
                {
                    statusCode = 200;
                    let book: any = {};
                    book.status = 200;
                    book.message = "Document Successfully deleted";
                    return book;
                } else {
                    errMsg = "Deleting document failed";
                    statusCode = 200;
                    callback(true)
                }
            }
        ], function(err: any, book: any)
        {
            try 
            {   
                if(err)
                {
                    responze.send(res, errMsg, statusCode, '');
                } else {              
                    responze.send(res, '', statusCode, book);
                }
            } catch (error) {
                responze.send(res, error, 500, "");
            }  
        })
    }
}

exports.booking = booking;









