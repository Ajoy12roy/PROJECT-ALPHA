import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Research } from "@/models/Research";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await connectToDatabase();
    
    // ১. ডাটাবেসে স্ট্যাটাস আপডেট করে 'Approved' করা হলো
    await Research.findByIdAndUpdate(id, { status: 'Approved' });

    // ২. HTML সাকসেস পেজ বাদ দিয়ে সরাসরি Mercury পেজে রিডাইরেক্ট (Redirect) করা হচ্ছে
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/planet/mercury`);

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}