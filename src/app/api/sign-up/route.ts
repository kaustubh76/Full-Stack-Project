import dbConnect from "@/src/lib/dbConnect"; 
import UserModel from "@/src/model/User"; 
import bcrypt from "bcryptjs"; 
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail"; 

// The POST function is an HTTP endpoint handler, triggered when a POST request is made to this endpoint
export async function POST(request: Request) {
    try {
        // Destructuring the username, email, and password from the request body, expecting a JSON payload
        const { username, email, password } = await request.json();
        
        // Searching for an existing user in the database with the provided username who is already verified
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });
        
        // If a verified user with the same username is found, respond with a status indicating the username is taken
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: true,
                message: "Username is already taken"
            }, { status: 400 }); // Returning a response with status code 400 indicating a bad request
        }

        // Searching for any existing user with the provided email, regardless of verification status
        const existingUserVerifiedByEmail = await UserModel.findOne({
            email
        });

        // Generating a random 6-digit code for email verification purposes
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        // If a user with the provided email exists in the database
        if (existingUserVerifiedByEmail) {
            // Check if the existing user is already verified
            if (existingUserVerifiedByEmail.isVerified) {
                // If verified, respond with a message indicating that a user already exists with the email
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                }, { status: 400 });

            } else {
                // If the user exists but is not verified, update the password, verification code, and expiry
                const hashedPassword = await bcrypt.hash(password, 10); // Using bcrypt to hash the new password securely
                existingUserVerifiedByEmail.password = hashedPassword; // Updating the user's password with the hashed password
                existingUserVerifiedByEmail.verifyCode = verifyCode; // Setting the new verification code for the user
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // Setting the expiry of the verification code to 1 hour from the current time
                await existingUserVerifiedByEmail.save(); // Saving the updated user document back to the database
            }
        } else {
            // If no user with the provided email exists, proceed to create a new user
            const hashedPassword = bcrypt.hashSync(password, 10); // Synchronously hashing the user's password for storage
            const expiryDate = new Date(); // Creating a new Date object representing the current time
            expiryDate.setHours(expiryDate.getHours() + 1); // Setting the expiry date to 1 hour ahead of the current time

            // Creating a new user document using the UserModel with the provided and generated details
            const newUser = new UserModel({
                username, // Setting the username field
                email, // Setting the email field
                password: hashedPassword, // Setting the hashed password
                verifyCode, // Setting the verification code
                verifyCodeExpiry: expiryDate, // Setting the verification code expiry time
                isVerified: false, // Setting the initial verification status to false
                isAcceptingMessages: true, // Setting a default value to allow message acceptance
                messages: [] // Initializing with an empty array to store future messages
            });

            await newUser.save(); // Saving the new user document to the database
        }

        // Attempting to send a verification email to the user with the provided email, username, and verification code
        const emailResponse = await sendVerificationEmail(
            email, // User's email address
            username, // User's username
            verifyCode // Generated verification code
        );

        // Checking if the email sending was unsuccessful
        if (!emailResponse.success) {
            // If email sending fails, return a response with an error message and status code 500
            return Response.json({
                success: false,
                message: emailResponse.message
            },
                {
                    status: 500 // Indicating an internal server error
                }
            );
        }

        // If the sign-up process and email sending are successful, respond with a success message
        return Response.json({
            success: true,
            message: "Sign-up successful. Please verify your email."
        }, { status: 201 }); // Returning a response with status code 201 indicating successful creation

    } catch (error) {
        // Catching any errors that occur during the sign-up process, logging the error, and returning a failure response
        console.log('Error executing sign-up', error); // Logging the error to the console for debugging purposes
        return Response.json(
            {
                success: false,
                message: "Failed to sign-up" // Providing a generic error message for the client
            },
            {
                status: 500 // Indicating an internal server error occurred
            }
        );
    }
}
