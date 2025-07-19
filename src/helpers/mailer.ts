import User from "@/model/userModel";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";

export const sendEmail = async({email, emailType, userId}: any) => {
    try {
        console.log('Starting email send process for:', email, 'Type:', emailType);
        
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        console.log('Generated hashed token');
        
        // Update user with token
        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken, 
                verifyTokenExpiry: Date.now() + 3600000
            });
            console.log('Updated user with verify token');
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken, 
                forgotPasswordTokenExpiry: Date.now() + 3600000
            });
            console.log('Updated user with reset token');
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAILTRAP_USER, // Make sure this is correct
                pass: process.env.MAILTRAP_PASS
            }
            
        });

        console.log('Transporter created');

        // Verify transporter
        try {
            await transporter.verify();
            console.log('Transporter verified successfully');
        } catch (verifyError:any) {
            console.error('Transporter verification failed:', verifyError);
            throw new Error('SMTP configuration error: ' + verifyError.message);
        }

        // Mail options
        const mailOptions = {
            from: 'k.tushar1106@gmail.com',
            to: email,
            subject: emailType === 'VERIFY' ? "Verify your Email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
                or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
                </p>`
        };

        console.log('Mail options prepared:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        // Send email
        const mailResponse = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', mailResponse.messageId);
        
        return mailResponse;

    } catch (error: any) {
        console.error('Email sending error:', error);
        console.error('Error stack:', error.stack);
        throw new Error(`Email sending failed: ${error.message}`);
    }
}