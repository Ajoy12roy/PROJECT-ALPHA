import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Research } from "@/models/Research";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await connectToDatabase();
    
    // ডাটাবেসে স্ট্যাটাস আপডেট করে 'Approved' করা হলো
    const result = await Research.findByIdAndUpdate(id, { status: 'Approved' }, { new: true });

    if (!result) {
      return NextResponse.json({ error: "Research not found" }, { status: 404 });
    }

    // JSON সাকসেস রেসপন্স রিটার্ন করা (রিডাইরেক্ট নয়)
    return NextResponse.json({
      success: true,
      message: "Research approved and published successfully!",
      planet: result.planet,
      topic: result.topic
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}