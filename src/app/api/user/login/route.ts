import {connect} from '@/dbConfig/dbconfig'
import User from '@/model/userModel'
import bcryptjs from 'bcryptjs'
import {NextResponse,NextRequest} from 'next/server'
import jwt from 'jsonwebtoken'

connect()

export async function POST(request:NextRequest) {
    try {
        const reqBody=await request.json()
        const {email,password}= reqBody

        console.log(reqBody);

        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error:"User doesnot exist"},{ status:500}) 
        }
        console.log("user exist");
        
        const validPassword = await bcryptjs.compare(password,user.password)

        if (!validPassword) {
            return NextResponse.json({error:"check your credentails "},{ status:500}) 
        }

        const tokenData = {
            id: user._id,
            username:user.username,
            email:user.email
        }
        
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn:'1h'})

        const response = NextResponse.json({
            message:"logged in successfully",
            success: true
        })

        response.cookies.set('token',token,{
            httpOnly: true
        })

        return response

    } catch (error:any) {
        return NextResponse.json({error:error.message},{ status:500}) 
    }
}