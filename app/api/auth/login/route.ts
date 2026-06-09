import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়" }, { status: 400 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ error: "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়" }, { status: 400 });
    }

    return NextResponse.json({
      message: "লগইন সফল হয়েছে",
      user: { id: user._id, name: user.name, email: user.email }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "সার্ভার এরর" }, { status: 500 });
  }
}