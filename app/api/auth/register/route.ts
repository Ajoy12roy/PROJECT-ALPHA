import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "সবগুলো ফিল্ড পূরণ করুন" }, { status: 400 });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: "এই ইমেইলটি ইতিমধ্যে নিবন্ধিত" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "অ্যাকাউন্ট তৈরি সফল হয়েছে" }, { status: 201 });
  } catch (error: any) {
    // টার্মিনালে আসল এরর প্রিন্ট করবে
    console.error("Registration Error:", error); 
    return NextResponse.json({ error: "সার্ভার এরর: ডাটাবেজ কানেকশন বা অন্য সমস্যা" }, { status: 500 });
  }
}