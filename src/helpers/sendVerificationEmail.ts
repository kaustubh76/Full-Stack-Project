// Importing the 'resend' object from the local module '../lib/resend'.
import { resend } from "../lib/resend";

// This component is used to generate the content of the verification email.
import VerificationEmail from "../../emails/VerificationEmail";

// This type defines the structure of the response returned by the function.
import { ApiResponse } from "../types/ApiResponse";

// This function sends a verification email and returns a Promise of type 'ApiResponse'.
export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        // Using the 'resend' object to send an email with specific parameters.
        // 'react' is a React component used to render the email's content, which is passed the 'username' and 'verifyCode' to display in the email.
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry Message | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        // Returning an object indicating the email was sent successfully.
        return {
            success: true,
            message: "Sent verification email successfully"
        };
    } catch (emailError) {
        // Logging the error if sending the email fails.
        console.log("Error sending verification email", emailError);

        // Returning an object indicating the email sending failed.
        return {
            success: false,
            message: "Failed to send verification email"
        };
    }
}
