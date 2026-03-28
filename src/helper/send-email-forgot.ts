import nodemailer from 'nodemailer';

export const sendEmailToUserForgot  =   async (data: any): Promise<any> =>
{
    let mailMessage =
        `
            <!DOCTYPE html>
                <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                    <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <meta name="x-apple-disable-message-reformatting">
                <title></title>

                <style>
                    table, td, div, h1, p {
                    font-family: Arial, sans-serif;
                    }
                    @media screen and (max-width: 530px) {
                    .unsub {
                        display: block;
                        padding: 8px;
                        margin-top: 14px;
                        border-radius: 6px;
                        background-color: #555555;
                        text-decoration: none !important;
                        font-weight: bold;
                    }
                    .col-lge {
                        max-width: 100% !important;
                    }
                    }
                    @media screen and (min-width: 531px) {
                    .col-sml {
                        max-width: 27% !important;
                    }
                    .col-lge {
                        max-width: 73% !important;
                    }
                    }
                </style>
                </head>
                <body style="margin:0;padding:0;word-spacing:normal;background-color:#ffffff;padding-top: 10px;">
                <div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#ffffff;">
                    <table role="presentation" style="width:100%;border:none;border-spacing:0;">
                    <tr>
                        <td align="center" style="padding:0;">
                        <!--[if mso]>
                        <table role="presentation" align="center" style="width:600px;">
                        <tr>
                        <td>
                        <![endif]-->
                        <table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">
                            <tr>
                            <td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;background-color: #404040;">
                                <a href="https://technicianswork.com" style="text-decoration:none;"><img src="https://technicianswork.com/Technicians%20Logo.png" alt="Logo" style="width:165px;max-width:80%;height:auto;border:none;text-decoration:none;color:#ffffff;"></a>
                            </td>
                            </tr>
                            <tr>
                            <td style="padding-top:10px;padding-bottom:5px;padding-left:30px;padding-right:30px; background-color:#ffca0a;">
                            </td>
                            </tr>
                            <tr>
                            <td style="padding-top:15px;padding-bottom:0px;padding-left:30px;padding-right:30px;background-color:#ffffff;">
                                <h1 style="margin-top:0;margin-bottom:13px;font-size:20px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">Hi ${data?.firstname} ${data?.surname}, </h1>
                            </td>
                            </tr>
                            <tr>
                            <td style="padding-top:10px;padding-bottom:15px;padding-left:30px;padding-right:30px; background-color:#ffffff;">
                            </td>
                            </tr>
                            <tr style="margin-top:100px;">
                            <td style="padding-top:0px;padding-bottom:30px;padding-left:30px;padding-right:30px; background-color:#ffffff;">
                                <span style="margin:0;font-size: 17px;">You are one step away from getting your account back</span>
                            </td>
                            </tr>
                            <tr>

                            <tr>
                            <td style="padding-top:0px;padding-bottom:30px;padding-left:30px;padding-right:30px;background-color:#ffffff;text-align:center;">
                                <p style="margin:0;"></p>
                            </td>
                            </tr>

                            <tr>
                            <td style="padding-top:0px;padding-bottom:30px;padding-left:30px;padding-right:30px; background-color:#ffffff; align-content: center; width: 100%;">
                                <div style="text-align: center; width: 100%; vertical-align: middle; width: 100%; margin: auto;">                    
                                <a href="${data?.url}" style="background-color: darkblue; color: white; width: 100; text-decoration: none; border-radius: 30px; padding: 20px; text-align: center; cursor: pointer;">
                                    Reset your password
                                </a>
                                </div>
                            </td>
                            </tr>

                            <tr>
                            <td style="padding-top:0px;padding-bottom:30px;padding-left:30px;padding-right:30px;background-color:#ffffff;text-align:center;">
                                <p style="margin:0;"></p>
                            </td>
                            </tr>
                            <tr>
                            <td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#cccccc;">
                                <p style="margin:0 0 8px 0;"><a href="http://www.facebook.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/facebook_1.png" width="40" height="40" alt="f" style="display:inline-block;color:#cccccc;"></a> <a href="http://www.twitter.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/twitter_1.png" width="40" height="40" alt="t" style="display:inline-block;color:#cccccc;"></a></p>
                                <p style="margin:0;font-size:14px;line-height:20px;">&reg; Someone, Somewhere 2024<br><a class="unsub" href="http://www.example.com/" style="color:#cccccc;text-decoration:underline;">Unsubscribe instantly</a></p>
                            </td>
                            </tr>
                        </table>
                        <!--[if mso]>
                        </td>
                        </tr>
                        </table>
                        <![endif]-->
                        </td>
                    </tr>
                    </table>
                </div>
                </body>
                </html>            
        `
    
    // const { EMAIL_USER, EMAIL_PASSWORD, SERVER_HOST  } = process.env;

    // var transporter = nodemailer.createTransport(
    //     {
    //         service: 'cloud',
    //         host: SERVER_HOST,
    //         auth: {
    //             user: EMAIL_USER,
    //             pass: EMAIL_PASSWORD
    //         },
    //         secure: true,
    //         port: 465
    // })
    const { EMAIL_USER, EMAIL_PASSWORD, SERVER_HOST, SMTP_USERNAME, SMTP_PASSWORD  } = process.env;
    
    var transporter = nodemailer.createTransport(
     {
        host: SERVER_HOST,
        auth: {
             user: SMTP_USERNAME,
             pass: SMTP_PASSWORD
        },
        port: 2525
    })

    var mailOptions = 
    {
       from: EMAIL_USER,
       to: data.email,
       subject: 'Forgot Password: Technicians Work',
       // text: req.body.message + " " + firstSetOfPassword[i],
       html: mailMessage
    }
    try 
    {    
        return transporter.sendMail(mailOptions)
    } catch (error) {
       return false   
    }

    // transporter.sendMail(mailOptions, function(err: any, result: any)
    // {
    //     if(err) 
    //     {
    //         emailStatus = false
    //         console.log(false)
    //         console.log(err)
    //         return false;
    //     } else {
    //         console.log(true)
    //         emailStatus = true
    //         return true;
    //     }
    // });  
}
