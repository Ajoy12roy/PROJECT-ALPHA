import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/mongodb"; // আপনার মঙ্গোডিবি কানেকশন ফাইলের পাথ অনুযায়ী এটি চেক করে নিবেন
import { Research } from "@/models/Research";

export async function POST(req: Request) {
  try {
    // ১. ডাটাবেজ কানেক্ট করা
    await connectDB();

    // ২. ফ্রন্টএন্ড থেকে FormData রিসিভ করা
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const userId = formData.get("userId") as string || "guest";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ৩. ফাইলটিকে Buffer-এ কনভার্ট করা
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ৪. ইউনিক ফাইলনেম তৈরি করা (যাতে এক নামের ফাইল ওভাররাইট না হয়)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.name);
    const uniqueFileName = `research-${uniqueSuffix}${fileExtension}`;
    
    // ৫. প্রজেক্টের রুট ডিরেক্টরিতে 'uploads' ফোল্ডারে ফাইল সেভ করা
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const storedFilePath = path.join(uploadDir, uniqueFileName);
    fs.writeFileSync(storedFilePath, buffer);

    // ফাইল সাইজ বের করা
    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";

    // ৬. ডাটাবেজে ফাইল ইনফরমেশন সেভ করা
    const submission = await Research.create({
      userId,
      userName: name,
      userEmail: email,
      originalFileName: file.name,
      storedFilePath: storedFilePath,
      fileSize: fileSizeInMB,
      status: "Pending"
    });

    // ７. ইমেইল ট্রান্সপোর্টার সেটআপ (SMTP Configuration)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // অ্যাপ পাসওয়ার্ড ব্যবহার করতে হবে
      },
    });

    // ৮. আপনার রিকোয়ারমেন্ট অনুযায়ী ইমেইলের বডি ও সাবজেক্ট তৈরি
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Research File Submitted",
      text: `A new research file has been submitted.
User Name: ${name}
User Email: ${email}
File Name: ${file.name}
File Size: ${fileSizeInMB}
Upload Time: ${new Date().toLocaleString()}

The uploaded file is attached to this email.`,
      attachments: [
        {
          filename: file.name,
          path: storedFilePath, // এই ফাইলটিই অ্যাটাচমেন্ট হিসেবে চলে যাবে
        },
      ],
    };

    // ৯. ইমেইল সেন্ড করা
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Submission successful!", data: submission });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}