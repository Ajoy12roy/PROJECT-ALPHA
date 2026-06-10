import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "E-mail and password" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "E-mail or password incorrect" }, { status: 400 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ error: "E-mail or password incorrect" }, { status: 400 });
    }

    return NextResponse.json({
      message: "log-in Successfull",
      user: { id: user._id, name: user.name, email: user.email }
    }, { status: 200 });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Server error ,,try again " }, { status: 500 });
  }
}