import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { amount, currency } = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: amount * 100, 
      currency: currency || "INR",
      payment_capture: 1, 
    };

    const order = await razorpay.orders.create(options);
    // console.log("order : ", order)
    // return NextResponse.json({ success: true, order });
    return new Response(JSON.stringify({
        success: true,
        message: "Order Created Successfully",
        order
    }), { status: 201 });
  } catch (error) {
    console.error("Razorpay Error:", error);
    // return NextResponse.json({ success: false, error }, { status: 500 });
    return new Response(JSON.stringify({
        success: false,
        message: "Razorpay Error",
        error
    }), { status: 500 });
  }
}
