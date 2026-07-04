import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    // ১. ডাটাবেজ কানেক্ট করা
    await connectToDatabase();
    
    // ২. ফ্রন্টএন্ড থেকে ডাটা রিসিভ করা
    const { name, email, password } = await request.json();

    // ৩. ডাটা ভ্যালিডেশন
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    // ৪. ইমেইল আগে থেকেই আছে কি না চেক করা
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // ৫. পাসওয়ার্ড হ্যাশ (Hash) বা সিকিউর করা
    const hashedPassword = await bcrypt.hash(password, 10);

    // ৬. নতুন ইউজার ডাটাবেজে সেভ করা
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // ৭. সফল মেসেজ পাঠানো
    return NextResponse.json({
      message: "Account created successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    }, { status: 201 });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Registration Error Details:", errorMessage);
    
    return NextResponse.json({ 
      error: "Database connection or server error occurred", 
      details: errorMessage 
    }, { status: 500 });
  }
}