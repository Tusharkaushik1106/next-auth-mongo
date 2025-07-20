"use client"

import React,{useState} from 'react'
import axios from 'axios'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'


export default function page() {
    const router = useRouter()
    const [data, setData] = useState("nothing")

    const getUserDetails = async()=>{
       try {
            const res = await axios.post("/api/user/me")
            console.log("Full response:", res.data);
            
            // Check the actual structure of your response
            // It's likely either res.data._id or res.data.data._id
            const userId = res.data.data?._id || res.data._id;
            
            if (userId) {
                setData(userId)
                toast.success("User details fetched successfully")
            } else {
                toast.error("User ID not found in response")
            }
        } catch (error: any) {
            console.log("getUserDetails error:", error);
            toast.error("Failed to fetch user details")
            
            // More specific error handling
            if (error.response?.status === 401) {
                toast.error("Please login first")
                router.push("/login")
            } else if (error.response?.status === 500) {
                toast.error("Server error - please try again")
            }
        }
    }

    const logout = async()=>{
         try {
            await axios.get('/api/user/logout')
            toast.success("logout is success")
            router.push("/login")
         } catch (error:any) {
            console.log(error.message);
            toast.error(error.message)
         }
    }

  return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <hr />
            <p>Profile page</p>
            <h2 className="p-1 rounded bg-green-500">{data === 'nothing' ? "Nothing" : <Link href={`/profile/${data}`}>{data}
            </Link>}</h2>
        <hr />
        <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >Logout</button>

        <button
        onClick={getUserDetails}
        className="bg-green-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >GetUser Details</button>


            </div>
    )
}

