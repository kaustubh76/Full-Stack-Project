import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";

export async function POST(request: Request){
    try {
        
    } catch (error) {
        console.log('Error executing sign-up', error)
        return Response.json(
            {
                success: false,
                message: "Failed to sign-up"
            },
            {
                status: 500
            }
        )

}