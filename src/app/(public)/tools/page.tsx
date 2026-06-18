import type { Metadata } from "next";
import { tools } from "@/lib/tools";
import ToolsDashboardContent from "./ToolsPageContent";

export const metadata: Metadata = {
  title: "Precision Digital Workbench | Deadraon Tools Suite",
  description: "High-precision, 100% private digital utilities for developers. PDF merging, image compression, OCR to text, background removal, media downloader, QR codes, and more.",
  keywords: ["Free Developer Tools", "Online PDF Merge", "Online Image Compressor", "Image Background Remover", "Free Media Downloader", "Online OCR Reader", "JSON Formatter", "JWT Decoder"],
};

export default function ToolsDashboard() {
  return <ToolsDashboardContent toolsList={tools} />;
}
