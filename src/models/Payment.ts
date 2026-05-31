import mongoose, { Schema, type Document } from "mongoose";

export interface IPayment extends Document {
  orderId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  amount: number;
  note?: string;
  status: "pending" | "success" | "failed";
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    amount: { type: Number, required: true },
    note: String,
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    projectId: { type: String }, // Stored as a string representing the project ID
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);
