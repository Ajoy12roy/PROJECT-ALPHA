import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    // ডাটাবেজ কানেক্ট করা হচ্ছে
    await connectToDatabase();
    
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Please fill in all fields" }, { status: 400 });
    }

    // ইমেইল ইতিমধ্যে আছে কিনা চেক
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: "This email is already registered." }, { status: 400 });
    }

    // পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // নতুন ইউজার তৈরি
    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "Successfully create account" }, { status: 201 });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Database connection or server error occurred" }, { status: 500 });
  }
}