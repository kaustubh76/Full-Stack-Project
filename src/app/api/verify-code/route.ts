import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { UserRound } from "lucide-react";


export async function POST(request:Request) {
    try {
        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status: 404}
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(
            isCodeValid &&
            isCodeNotExpired
        ){
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: "User verified"
                }
            )
        }
        else if(
            !isCodeNotExpired
        ){
            return Response.json(
                {
                    success: false,
                    message: "Invalid code"
                },
                {status: 400}
            )
        }

    } catch (error) {
        console.log("Error verfying user", error)
        return Response.json(
            {
                success:false,
                message: "Error verfying user"
            },
            {status: 500}
        )
    }
}
