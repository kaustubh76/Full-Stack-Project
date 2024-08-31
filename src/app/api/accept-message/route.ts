import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";

export async function POST(request: Request){
        await dbConnect()
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User

        if(!session || !session.user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status: 404}
            )
       
         } 
    

    const userId = user._id;
    const {acceptMessage } = await request.json()

    try {
        const foundUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessage },
            { new: true }
        )
        if(!foundUser){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status: 401}
            )
        }
        
        return Response.json(
            {
                success: true,
                message: "Message accepted", foundUser
            }, {status:200}
        )
    }

    catch(error){
        console.log("Error accepting message", error)
        return Response.json(
            {
                success: false,
                message: "Error accepting message"
            },
            {status: 500}
        )
    }
}

export async function GET(request: Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {status: 401}
        )
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status: 401}
            )
        }
        
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages
            }, {status:200}
        )
    }

    catch(error){
        console.log("Error accepting message", error)
        return Response.json(
            {
                success: false,
                message: "Error accepting message"
            },
            {status: 500}
        )
    }
}
