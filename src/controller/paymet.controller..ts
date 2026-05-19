import { Router, Request, Response, NextFunction } from "express"
import IController from "@/interfaceIController"
import JobService from "@/service/job.service";
import mongoose from "mongoose";
import axios from "axios";
import Payment from "@/model/payment";


class PaymentController implements IController {

    public path = '/payment';
    public router = Router();
    private jobService = new JobService();


    constructor()
    {
        this.initializeRoutes()
    }

    private initializeRoutes(): void
    {
        this.router.post(`${this.path}/job-status`,
            // validateMiddleware(validate.register),
            this.initializePayment
        )

        this.router.post(`${this.path}/verify`,
            // validateMiddleware(validate.register),
            this.verify
        )
        
    }

   
    private initializePayment = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

        try 
        {
            const { email, amount } = req.body;
            const response = await axios.post(`${process.env.PAYSTACK_INITIALIZE_KEY}`, { email, amount: amount * 100 },
                {
                    headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    },
                }
            );
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json(error);
        }
    }

       
    private verify = async (req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<Response | void> => {

        try 
        {
            const { reference, user } = req.body
            if(!mongoose.isValidObjectId(user)) 
            {    
              const data: { message: string, data: object, statusCode: number } = 
              {
                message: 'Invalid parameter passed',
                data: { },
                statusCode: 404
              }
              res.status(404).json(data)
            } else {
                const response = await axios.get(`${process.env.PAYSTACK_VERIFY_PAYMENT}/${reference}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        },
                    }
                );
                
                const VerificationData = 
                {
                    user: user,
                    domain: response?.data?.data?.domain,
                    status: response?.data?.data?.status,
                    reference: response?.data?.data?.reference,
                    receipt_number: response?.data?.data?.receipt_number,
                    amount: response?.data?.data?.amount,
                    responseCode: response?.data?.data?.responseCode,
                    paidAt: response?.data?.data?.paidAt,
                    createdAt: response?.data?.data?.createdAt,
                    channel: response?.data?.data?.channel,
                    currency: response?.data?.data?.currency,
                    ipAddress: response?.data?.data?.ipAddress,
                    referer: response?.data?.data?.referer,
                    customerId: response?.data?.data?.customer?.id,
                    customer: response?.data?.data?.customer?.id,
                    customerFirstname: response?.data?.data?.customer?.first_name,
                    customerLastname: response?.data?.data?.customer?.last_name,
                    customerEmail: response?.data?.data?.customer?.email,
                    customerCode: response?.data?.data?.customer?.customer_code,
                    customerPhone: response?.data?.data?.customer?.phone,
                    customerRiskAction: response?.data?.data?.customer?.risk_action
                }
                Payment.create(VerificationData)
                res.status(200).json(VerificationData)
            }
        } catch (error) {
            res.status(400).json(error);
        }
    }

}

export default PaymentController;