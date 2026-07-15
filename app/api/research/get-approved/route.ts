import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Research } from "@/models/Research";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const planet = searchParams.get('planet');

    await connectToDatabase();

    if (planet) {
      // নির্দিষ্ট গ্রহের জন্য অনুমোদিত গবেষণা আনা হচ্ছে
      const papers = await Research.find({ 
        planet: planet,
        status: 'Approved' 
      }).sort({ uploadDate: -1 });
      return NextResponse.json(papers);
    } else {
      // সকল অনুমোদিত গবেষণা আনা হচ্ছে (উইথআউট ফিল্টারিং)
      const papers = await Research.find({ status: 'Approved' }).sort({ uploadDate: -1 });
      return NextResponse.json(papers);
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch approved papers" }, { status: 500 });
  }
}