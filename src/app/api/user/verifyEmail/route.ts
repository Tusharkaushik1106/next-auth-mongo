import {connect} from '@/dbConfig/dbconfig'
import User from '@/model/userModel'

import {NextResponse,NextRequest} from 'next/server'

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {token} = reqBody
        console.log(token);

        const user = await User.findOne({verifyToken:token,verifyTokenExpiry:{$gt:Date.now()}})

        if (!user) {
            return NextResponse.json({error:"Invalid token detail"},{ status:400}) 
        }
        console.log(user);

        user.isVerified=true
        user.verifyTokenExpiry=undefined
        user.verifyToken=undefined

        await user.save()
        return NextResponse.json({message:"Email verified successfully",
            success:true
        },{ status:500}) 
        
        
    } catch (error:any) {
     return NextResponse.json({error:error.message},{ status:500})   
    }
    
}