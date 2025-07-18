import {connect} from '@/dbConfig/dbconfig'
import User from '@/model/userModel'

import {NextResponse,NextRequest} from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from '@/helpers/mailer'

connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody=await request.json()
        const {username,email,password}= reqBody

        console.log(reqBody);

        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({error: 'User already exist'},
                {status:400}
            )
        }

        const salt = await bcryptjs.genSaltSync(10);
        const hashedPassword = await bcryptjs.hash(password,salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser);
        
        //send verification email

        await sendEmail({email,emailType:"VERIFY", userId:savedUser._id})
        return NextResponse.json({
            message: 'user registered successfully',
            success: true,
            savedUser

        })




    } catch (error:any) {
        return NextResponse.json({error: error.message},
            {status:500}
        )
        
    }
}