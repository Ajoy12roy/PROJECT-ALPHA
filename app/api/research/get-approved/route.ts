import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Research } from "@/models/Research";

export async function GET() {
  try {
    await connectToDatabase();
    // শুধুমাত্র "Approved" স্ট্যাটাসের ডাটাগুলো আনবে (নতুনগুলো আগে)
    const papers = await Research.find({ status: 'Approved' }).sort({ uploadDate: -1 });
    return NextResponse.json(papers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch approved papers" }, { status: 500 });
  }
}