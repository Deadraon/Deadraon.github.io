import { notFound } from "next/navigation";
import { getTool, tools, SITE_URL } from "@/lib/tools";
import { ToolShell } from "@/components/ToolShell";
import { ComingSoonTool } from "@/components/tools/ComingSoonTool";
import { PdfMergeTool } from "@/components/tools/PdfMergeTool";
import { PdfSplitTool } from "@/components/tools/PdfSplitTool";
import { ImageCompressTool } from "@/components/tools/ImageCompressTool";
import { QrGenerateTool } from "@/components/tools/QrGenerateTool";
import { WordCountTool } from "@/components/tools/WordCountTool";
import { ColorConvertTool } from "@/components/tools/ColorConvertTool";
import { OnlineRulerTool } from "@/components/tools/OnlineRulerTool";
import { ResumeBuilderTool } from "@/components/tools/ResumeBuilderTool";
import { ImageOcrTool } from "@/components/tools/ImageOcrTool";
import { BgRemoveTool } from "@/components/tools/BgRemoveTool";
import { MediaDownloadTool } from "@/components/tools/MediaDownloadTool";
import { JsonFormatterTool } from "@/components/tools/JsonFormatterTool";
import { Base64Tool } from "@/components/tools/Base64Tool";
import { HashGeneratorTool } from "@/components/tools/HashGeneratorTool";
import { UuidGeneratorTool } from "@/components/tools/UuidGeneratorTool";
import { LoremIpsumTool } from "@/components/tools/LoremIpsumTool";
import { TimestampConverterTool } from "@/components/tools/TimestampConverterTool";
import { UnitConverterTool } from "@/components/tools/UnitConverterTool";
import { RegexTesterTool } from "@/components/tools/RegexTesterTool";
import { MarkdownPreviewTool } from "@/components/tools/MarkdownPreviewTool";

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

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  const url = `${SITE_URL}/tools/${slug}`;
  return {
    title: `${tool.name} — Precision Tools`,
    description: tool.tagline,
    openGraph: { title: `${tool.name} — Precision Tools`, description: tool.tagline, url, type: "website" },
    alternates: { canonical: url },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.tagline,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `${SITE_URL}/tools/${slug}`,
  };

  const impl = implementations[tool.slug];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolShell tool={tool}>
        {impl ? impl() : <ComingSoonTool name={tool.name} />}
      </ToolShell>
    </>
  );
}
