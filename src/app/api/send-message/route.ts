import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { Message } from "@/src/model/User";

export async function POST(request: Request){
    await dbConnect()
    const { username, content } = await request.json()
   try {
     const user = await UserModel.findOne({ username})
        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status: 404}
            )
        }

        //is user accepting a message
        if(!user.isAcceptingMessages){
            return Response.json(
                {
                    success: false,
                    message: "User not accepting messages"
                },
                {status: 403}
            )
        }

        const newMessage = {
            content,
            createdAt: new Date()
        }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message sent"
            },
            {status: 200}
        )
   } catch (error) {
     console.log("Error sending message", error)
     return Response.json(
         {
             success: false,
             message: "Internal server error"
         },
         {status: 500}
     )
    
   }
}