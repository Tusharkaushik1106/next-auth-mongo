import {connect} from '@/dbConfig/dbconfig'
import User from '@/model/userModel'

import {NextResponse,NextRequest} from 'next/server'

import { getDataFromToken } from '@/helpers/getDataFromToken'

connect()

export async function POST(request:NextRequest) {

    const userId = await getDataFromToken(request)

    const user = User.findOne({_id:userId}).select("-password")

    return NextResponse.json({
        message:"User Found",
        success : true,
        data:user
    })
}
