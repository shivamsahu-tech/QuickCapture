import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get("profileImage") as File;

    if (!file) {
    //   return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        return new Response(JSON.stringify({
            success: false,
            message: "No file uploaded",
        }), { status: 400 });
    }

    // Convert file to a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save locally in `public/uploads`
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      folder: "profile_pictures",
    });

    // Return Cloudinary image URL
    // return NextResponse.json({ success: true, imageUrl: uploadResponse.secure_url });
    return new Response(JSON.stringify({
        success: true,
        message: "File upload Successfully",
        data: uploadResponse.secure_url
    }), { status: 201 });
  } catch (error) {
    console.error("Upload Error:", error);
    // return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
    return new Response(JSON.stringify({
        success: false,
        message: "Upload Failed",
        data: error
    }), { status: 500 });
  }
}
