import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import {z} from "zod"
import bcrypt from 'bcryptjs'
import { usernameValidation } from "@/src/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation

})

export async function GET(request:Request){
    //TODO: Use this in other routes as well
    console.log(`Recieved request with method: ${request.method}`);
    if(request.method!='GET'){
        return Response.json(
            {
                success: false,
                message: "Invalid request method"
            },
            {status: 405}
        )
    }

    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const queryParm = {
            username: searchParams.get('username')
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParm)
        if(!result.success){
            const UsernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success:false,
                    message: UsernameErrors?.length >0 ? UsernameErrors.join(', ') : 'Invalid query parameters',
                },
                {status: 400}
            )
        }
        
        const { username } = result.data

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true})
        
        if(existingVerifiedUser){
            return Response.json(
                {
                    success: false,
                    message: "Username already exists"
                },
                {status: 400}
            )
        }
    } catch (error) {
        console.log("Error checking username", error)
        return Response.json(
            {
                success:false,
                message: "Error checking username"
            },
            {status: 500}
        )
    }
}