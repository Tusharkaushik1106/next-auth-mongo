import {connect} from '@/dbConfig/dbconfig'

import {NextResponse,NextRequest} from 'next/server'


connect()

export async function POST(request:NextRequest) {
    try {
        const response = NextResponse.json({
            message:"logout success",
            success: true
        })

        response.cookies.set("token","",{
            httpOnly:true,
            expires: new Date(0)
        })

        return response


    } catch (error:any) {
        return NextResponse.json({error:error.message},{ status:500}) 
    }

}