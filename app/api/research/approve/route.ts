import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Research } from "@/models/Research";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await connectToDatabase();
    await Research.findByIdAndUpdate(id, { status: 'Approved' });

    // অ্যাডমিনকে একটি সুন্দর সাকসেস স্ক্রিন দেখাবে
    return new NextResponse(`
      <html>
        <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #030712; color: white;">
          <div style="text-align: center; padding: 40px; background: #0f172a; border-radius: 16px; border: 1px solid #059669; box-shadow: 0 0 30px rgba(5,150,105,0.2);">
            <h1 style="color: #10b981; margin-bottom: 10px;">Paper Approved Successfully! ✓</h1>
            <p style="color: #94a3b8;">The research paper is now live and visible on the website.</p>
          </div>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}