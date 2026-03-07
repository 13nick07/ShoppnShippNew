import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // UUID
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, default: "user" }, // user | admin
  membershipPlan: { type: String, default: "Free" }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);