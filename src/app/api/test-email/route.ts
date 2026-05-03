// It works! TODO: DELETE LATER
import { resend } from "@/lib/resend";
import VerificationEmail from "../../../../emails/VerificationEmail";

export async function GET() {
    try {
        await resend.emails.send({
            from: "Test App <onboarding@resend.dev>",
            to: "shibambiswas169@gmail.com", // put your email here
            subject: "Test Email",
            react: VerificationEmail({ username: "Tester", otp: "123456" }),
        });

        return Response.json({ success: true, message: "Email sent ✅" });
    } catch (err) {
        console.error(err);
        return Response.json({ success: false, error: String(err) }, { status: 500 });
    }
}
