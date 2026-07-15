import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb"; 
import { Research } from "@/models/Research";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const topic = formData.get("topic") as string;
    const description = formData.get("description") as string;
    const planet = formData.get("planet") as string; // গ্রহের নাম
    const userId = formData.get("userId") as string || "guest";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.name);
    const uniqueFileName = `research-${uniqueSuffix}${fileExtension}`;
    
    // 🛠️ পরিবর্তন ১: ফাইলটি 'public/uploads' ফোল্ডারে সেভ করা হচ্ছে
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const storedFilePath = path.join(uploadDir, uniqueFileName);
    fs.writeFileSync(storedFilePath, buffer);

    // 🛠️ পরিবর্তন ২: ডাটাবেসে সেভ করার জন্য পাবলিক পাথ তৈরি (এটি ব্রাউজারে কাজ করবে)
    const publicFilePath = `/uploads/${uniqueFileName}`;
    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";

    const submission = await Research.create({
      userId,
      userName: name,
      userEmail: email,
      originalFileName: file.name,
      storedFilePath: publicFilePath, // পাবলিক লিঙ্ক ডাটাবেসে সেভ হচ্ছে
      fileSize: fileSizeInMB,
      topic: topic,
      description: description,
      planet: planet, // গ্রহের নাম সেভ করা
      status: "Pending"
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, 
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Research File Submitted - Action Required",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>New Research Submission</h2>
          <p><strong>Researcher:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Topic:</strong> ${topic}</p>
          <p><strong>Abstract:</strong> ${description}</p>
          <p><strong>File Size:</strong> ${fileSizeInMB}</p>
          <br/>
          <a href="${baseUrl}/api/research/approve?id=${submission._id}" style="padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Approve & Publish</a>
        </div>
      `,
      attachments: [{ filename: file.name, path: storedFilePath }], // লোকাল পাথ ব্যবহার করে ইমেইলে এটাচ করা হচ্ছে
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: "Submission successful!", data: submission });
    
  } catch (error: unknown) { 
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    console.error("Upload Error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}