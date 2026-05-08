import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // The user receiving the notification
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: "info" }, // 'info', 'success', 'warning'
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
