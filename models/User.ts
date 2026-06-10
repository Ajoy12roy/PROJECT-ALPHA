import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
 createdAt: { type: Date, default: Date.now },
});

export const User = models.User || model("User", UserSchema);