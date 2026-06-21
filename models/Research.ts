import mongoose, { Schema, model, models } from "mongoose";

const ResearchSchema = new Schema({
  userId: { type: String, default: "guest" },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  originalFileName: { type: String, required: true },
  storedFilePath: { type: String, required: true },
  fileSize: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" }
});

export const Research = models.Research || model("Research", ResearchSchema);