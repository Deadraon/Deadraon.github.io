"use client";

import dynamic from "next/dynamic";

const ComingSoonTool = dynamic(() => import("@/components/tools/ComingSoonTool").then(mod => mod.ComingSoonTool), { ssr: false });
const PdfMergeTool = dynamic(() => import("@/components/tools/PdfMergeTool").then(mod => mod.PdfMergeTool), { ssr: false });
const PdfSplitTool = dynamic(() => import("@/components/tools/PdfSplitTool").then(mod => mod.PdfSplitTool), { ssr: false });
const ImageCompressTool = dynamic(() => import("@/components/tools/ImageCompressTool").then(mod => mod.ImageCompressTool), { ssr: false });
const QrGenerateTool = dynamic(() => import("@/components/tools/QrGenerateTool").then(mod => mod.QrGenerateTool), { ssr: false });
const WordCountTool = dynamic(() => import("@/components/tools/WordCountTool").then(mod => mod.WordCountTool), { ssr: false });
const ColorConvertTool = dynamic(() => import("@/components/tools/ColorConvertTool").then(mod => mod.ColorConvertTool), { ssr: false });
const OnlineRulerTool = dynamic(() => import("@/components/tools/OnlineRulerTool").then(mod => mod.OnlineRulerTool), { ssr: false });
const ResumeBuilderTool = dynamic(() => import("@/components/tools/ResumeBuilderTool").then(mod => mod.ResumeBuilderTool), { ssr: false });
const ImageOcrTool = dynamic(() => import("@/components/tools/ImageOcrTool").then(mod => mod.ImageOcrTool), { ssr: false });
const BgRemoveTool = dynamic(() => import("@/components/tools/BgRemoveTool").then(mod => mod.BgRemoveTool), { ssr: false });
const MediaDownloadTool = dynamic(() => import("@/components/tools/MediaDownloadTool").then(mod => mod.MediaDownloadTool), { ssr: false });
const JsonFormatterTool = dynamic(() => import("@/components/tools/JsonFormatterTool").then(mod => mod.JsonFormatterTool), { ssr: false });
const Base64Tool = dynamic(() => import("@/components/tools/Base64Tool").then(mod => mod.Base64Tool), { ssr: false });
const HashGeneratorTool = dynamic(() => import("@/components/tools/HashGeneratorTool").then(mod => mod.HashGeneratorTool), { ssr: false });
const UuidGeneratorTool = dynamic(() => import("@/components/tools/UuidGeneratorTool").then(mod => mod.UuidGeneratorTool), { ssr: false });
const LoremIpsumTool = dynamic(() => import("@/components/tools/LoremIpsumTool").then(mod => mod.LoremIpsumTool), { ssr: false });
const TimestampConverterTool = dynamic(() => import("@/components/tools/TimestampConverterTool").then(mod => mod.TimestampConverterTool), { ssr: false });
const UnitConverterTool = dynamic(() => import("@/components/tools/UnitConverterTool").then(mod => mod.UnitConverterTool), { ssr: false });
const RegexTesterTool = dynamic(() => import("@/components/tools/RegexTesterTool").then(mod => mod.RegexTesterTool), { ssr: false });
const MarkdownPreviewTool = dynamic(() => import("@/components/tools/MarkdownPreviewTool").then(mod => mod.MarkdownPreviewTool), { ssr: false });

const implementations: Record<string, () => React.ReactNode> = {
  "pdf-merge": () => <PdfMergeTool />,
  "pdf-split": () => <PdfSplitTool />,
  "image-compress": () => <ImageCompressTool />,
  "qr-generate": () => <QrGenerateTool />,
  "word-count": () => <WordCountTool />,
  "color-convert": () => <ColorConvertTool />,
  "online-ruler": () => <OnlineRulerTool />,
  "resume-builder": () => <ResumeBuilderTool />,
  "image-ocr": () => <ImageOcrTool />,
  "bg-remove": () => <BgRemoveTool />,
  "media-download": () => <MediaDownloadTool />,
  "json-formatter": () => <JsonFormatterTool />,
  "base64-encode": () => <Base64Tool />,
  "hash-generator": () => <HashGeneratorTool />,
  "uuid-generator": () => <UuidGeneratorTool />,
  "lorem-ipsum": () => <LoremIpsumTool />,
  "timestamp-converter": () => <TimestampConverterTool />,
  "unit-converter": () => <UnitConverterTool />,
  "regex-tester": () => <RegexTesterTool />,
  "markdown-preview": () => <MarkdownPreviewTool />,
};

interface ToolRendererProps {
  slug: string;
  name: string;
}

export function ToolRenderer({ slug, name }: ToolRendererProps) {
  const impl = implementations[slug];
  return impl ? impl() : <ComingSoonTool name={name} />;
}
