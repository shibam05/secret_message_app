import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Secret-Message <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry message | Verification Code',
            react: VerificationEmail({ username, otp: verifycode }),
        });
        return { success: true, message: "Successfully send the verification email" }

    } catch (emailError) {
        console.error("Error sending verification Email", emailError);
        return { success: false, message: "failed to send the verification email" }
    }
}