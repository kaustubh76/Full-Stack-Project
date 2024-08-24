import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          id: "credentials",
          name: "Credentials",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials:any) : Promise<any> {
            await dbConnect()
            try {
                const user = await UserModel.findOne({
                    $or: [
                        { email: credentials.identifier },
                        { username: credentials.identifier }
                    ]
                })
                if(!user){
                    throw new Error("No user found with this emaoil")
                }
                if(!user.isVerified){
                    throw new Error("User is not verified")
                }
                const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                if(isPasswordCorrect){
                    return user
                }else{
                    throw new Error("Password is incorrect")
                }
            } catch (err:any) {
                throw new Error(err)
            }
          }
        })
    ],
    callbacks: {
        async jwt({token, user }) {
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
            }
            return token
        },
        async session ({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.username = token.username
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages

            }
            return session
            console.log(
                "session",
                session
            );
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    
}