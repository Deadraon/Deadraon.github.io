import mongoose, { Schema, type Document } from "mongoose";

export interface IHi extends Document {

  createdAt: Date;
  updatedAt: Date;
}

const HiSchema = new Schema<IHi>(
  {

  },
  { timestamps: true }
);

export default mongoose.models.Hi ||
  mongoose.model<IHi>("Hi", HiSchema);
