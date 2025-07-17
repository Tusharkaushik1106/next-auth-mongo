import User from "@/model/userModel";
import bcryptjs from "bcryptjs";

import nodemailer from "nodemailer"

export const sendEmail= async({email,emailType,userId}:any)=>{
    try {
        const hashedToken=await bcryptjs.hash(userId.toString(),10)
       //TODO: cofigure mail for usage
       
       if (emailType==='VERIFY') {
        await User.findByIdAndUpdate(userId,
            {verifyToken:hashedToken, verifyTokenExpiry:Date.now()+3600000}
        )
        
       }else if(emailType==='RESET'){
        await User.findByIdAndUpdate(userId,
            {forgotPasswordToken:hashedToken, forgotPasswordTokenExpiry:Date.now()+3600000}
        ) 
       }

        const transporter = nodemailer.createTransport({

            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
            user: "a25cc3dd4e0984",
            pass: "****058d"
        }
    });

    const mailOptions = { 
    from: 'tushar@tushar.ai',
    to: email,
    subject: emailType=== 'VERIFY'? "Verify your Email": "reset your password",
    
    html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>` // HTML body
    }
    
    const mailResponse = await transporter.sendMail(mailOptions)
    return mailResponse


    } catch (error:any) {
        throw new Error(error.message)
    }
}