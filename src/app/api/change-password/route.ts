export const dynamic = 'force-dynamic';

import pool from "@/db/db";
import { verifyAccessToken } from "@/utils/jwt";
import { cookies } from "next/headers";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

/**
 * Uses: for verifiying otp and change password at forget password as well as change password request where otp already sent
 * Algo:
 * 1.for verifying forget password request
 *      get email from unknwonUserToken 
 *      get user by query in db with email
 * 2.for verifying change password request
 *      get userid from accessToken
 *      get user by query in db with usreid
 * // now we have full detail about user and otp and password sent by post request
 * now verify the otp with request otp within expire time
 * if otp verified :: change the password in db
 * clear all tokens
 * return 
 * 
 */

export async function POST(request: Request) {
    try {
        const cookieStore = cookies();
        const unknownUserToken = cookieStore.get("unknownUserToken")?.value;
        const accessToken = cookieStore.get("accessToken")?.value;
        let user;
        console.log( "unknnown user tomek : ", unknownUserToken)
        if (unknownUserToken) {
            try {
                const { email } = jwt.verify(
                    unknownUserToken,
                    process.env.UNKNOWN_USER_TOKEN_SECRET || 'defaultSecret'
                ) as JwtPayload;

                const result = await pool.query(
                    `SELECT * FROM users WHERE email = $1`,
                    [email]
                );

                user = result.rows[0];
            } catch (error) {
                console.error("Error in change-password api : ", error)
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "Invalid or expired token!",
                    }),
                    {
                        status: 401,
                    }
                );
            }
        } else if (accessToken) {
            const { userId } = verifyAccessToken(accessToken);

            const result = await pool.query(
                `SELECT * FROM users WHERE id = $1`,
                [userId]
            );

            user = result.rows[0];
        } else {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Unauthorized User!!",
                }),
                {
                    status: 401,
                }
            );
        }

        const { otp, password } = await request.json();

        if (!otp || !password) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "OTP and password are required!",
                }),
                {
                    status: 400,
                }
            );
        }

        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found!",
                }),
                {
                    status: 404,
                }
            );
        }

        const expiresAt = new Date(user.expires_at).getTime();
        const currentTime = Date.now();

        if (expiresAt < currentTime) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "OTP Expired!!",
                }),
                {
                    status: 400,
                }
            );
        }

        if (user.otp != otp) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Invalid OTP!!",
                }),
                {
                    status: 400,
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `UPDATE users SET password = $1 WHERE id = $2`,
            [hashedPassword, user.id]
        );

        cookieStore.delete("accessToken");
        cookieStore.delete("unknownUserToken");
        cookieStore.delete("refreshToken");

        return new Response(
            JSON.stringify({
                success: true,
                message: "Password change Successfully!!",
            }),
            {
                status: 202,
            }
        );
    } catch (error) {
        console.error("Error in change password api : ", error)
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal server error!!",
            }),
            {
                status: 500,
            }
        );
    }
}
