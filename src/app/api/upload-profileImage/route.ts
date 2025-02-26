import pool from "@/db/db";
import cloudinary from "@/lib/cloudinary";
import { verifyAccessToken } from "@/utils/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("profileImage") as File;

    if (!file) {
      return new Response(
        JSON.stringify({ success: false, message: "No file uploaded" }),
        { status: 400 }
      );
    }

    // Convert file to a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "profile_pictures",
    });

    console.log("url : ", uploadResponse.secure_url);

    // here upload the url at the database
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
        return new Response(JSON.stringify({
            success: false,
            message: "Access token is missing or invalid."
        }), {
            status: 401
        });
    }

    let userId;
    try {
        const decodedToken = verifyAccessToken(accessToken);
        userId = decodedToken.userId;
    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Invalid or expired access token."
        }), {
            status: 401
        });
    }

    try {
      //  check first whether the user already exist or not
      const isUserExist = await pool.query(`select * from profileimages where userid = $1`, [userId]);
  
      if(isUserExist.rows.length > 0){
        // user already exist just change the profile image
        const updateResult = await pool.query(`UPDATE profileimages SET profileimageurl = $1 WHERE userid = $2`, [uploadResponse.secure_url, userId]);
      } else {
        // inject a whole line with usreid and profile image url
        const insertResult = await pool.query(`INSERT INTO profileimages (userid, profileimageurl) VALUES ($1, $2)`, [userId, uploadResponse.secure_url]);
      }
    } catch (error) {
      console.error("Database Error : ", error);
      return new Response(
        JSON.stringify({
          success: false,
          message: "DataBase Query failed",
          error,
        }),
        { status: 500 }
      );
      
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "File uploaded successfully",
        imageUrl: uploadResponse.secure_url,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Upload Failed",
        error,
      }),
      { status: 500 }
    );
  }
}
