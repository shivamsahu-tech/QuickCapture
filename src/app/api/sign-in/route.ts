import { generateAccessAndRefreshToken } from "@/utils/jwt";
import bcrypt from 'bcrypt';
import { cookies } from "next/headers";
import pool from "@/db/db";
import sendEmail from "@/utils/sendEmail";


export async function POST(request: Request) {
    /**
     * Algo:
     * retrieve email and password 
     * check user from email
     * if exist: 
     *      compare password: equal: set cookies and reutrn success msg
     *      not equal: return msg with invalid credentials
     * return invalid credentials
     * 
     */
    try {
        const { email, password } = await request.json();
        console.log("email:", email, "Password:", password);

        const queryResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (queryResult.rows.length > 0) {
            const user = queryResult.rows[0];
            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (isPasswordCorrect) {
                const { accessToken, refreshToken } = generateAccessAndRefreshToken(user.id, email);

                if(!user.isverified){
                    const otp = Math.floor(100000 + Math.random() * 900000);
                    await pool.query("UPDATE users SET refreshToken = $1, otp = $2, expires_at = NOW() + INTERVAL '10 minutes' WHERE id = $3", [refreshToken, otp, user.id]);
                    console.log("reached till here")
                    //send email
                    await sendEmail({email, subject:"OTP Verification", otp})
                }else{
                    await pool.query("UPDATE users SET refreshToken = $1 WHERE id = $2", [refreshToken, user.id]);
                }


                const cookieStore = cookies();
                cookieStore.set("accessToken", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                });
                cookieStore.set("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                });

                return new Response(JSON.stringify({
                    success: true,
                    message: "User signed in successfully",
                    user
                }), { status: 201 });
            }
        }

        return new Response(JSON.stringify({
            success: false,
            message: "Invalid Credentials!"
        }), { status: 401 });

    } catch (error) {
        console.error("Error during sign-in:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Something went wrong!",
            error: error instanceof Error ? error.message : String(error)
        }), { status: 500 });
    }
}
