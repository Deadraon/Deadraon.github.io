export type ToolCategory =
  | "pdf"
  | "image"
  | "text"
  | "convert"
  | "generate"
  | "media"
  | "developer"
  | "calculator"
  | "security"
  | "data"
  | "color"
  | "code"
  | "encode";

export type ToolStatus = "live" | "coming-soon";

export interface Tool {
  slug: string;
  name: string;
  tagline: string;
  category: ToolCategory;
  status: ToolStatus;
  /**
   * If true, the tool runs entirely in the browser — files never leave the device.
   * Drives the "Processed locally" trust badge.
   */
  local: boolean;
}

export const CATEGORY_LABEL: Record<ToolCategory, string> = {
  pdf: "PDF",
  image: "Image",
  text: "Text",
  convert: "Convert",
  generate: "Generate",
  media: "Media",
  developer: "Developer",
  calculator: "Calculator",
  security: "Security",
  data: "Data",
  color: "Color",
  code: "Code",
  encode: "Encode",
};

export const tools: Tool[] = [
  {
    slug: "pdf-merge",
    name: "Merge PDFs",
    tagline: "Combine multiple PDFs into one, in order.",
    category: "pdf",
    status: "live",
    local: true,
  },
  {
    slug: "pdf-split",
    name: "Split PDF",
    tagline: "Pull pages out of a PDF into a new file.",
    category: "pdf",
    status: "live",
    local: true,
  },
  {
    slug: "image-compress",
    name: "Compress image",
    tagline: "Shrink JPEG and PNG files without visible loss.",
    category: "image",
    status: "live",
    local: true,
  },
  {
    slug: "qr-generate",
    name: "QR code",
    tagline: "Make a QR code for a link, text, or Wi-Fi.",
    category: "generate",
    status: "live",
    local: true,
  },
  {
    slug: "word-count",
    name: "Word counter",
    tagline: "Count words, characters, and reading time.",
    category: "text",
    status: "live",
    local: true,
  },
  {
    slug: "color-convert",
    name: "Color converter",
    tagline: "Translate HEX, RGB, and HSL on the fly.",
    category: "convert",
    status: "live",
    local: true,
  },
  {
    slug: "online-ruler",
    name: "Online ruler",
    tagline: "Accurate actual size physical measurements in inches, cm, and mm to scale.",
    category: "convert",
    status: "live",
    local: true,
  },
  {
    slug: "bg-remove",
    name: "Remove background",
    tagline: "Cut a clean transparent background from a photo.",
    category: "image",
    status: "live",
    local: true,
  },
  {
    slug: "image-ocr",
    name: "Image to text",
    tagline: "Pull readable text out of a screenshot or photo.",
    category: "image",
    status: "live",
    local: true,
  },
  {
    slug: "resume-builder",
    name: "Resume builder",
    tagline: "Draft a clean one-page resume and export PDF.",
    category: "generate",
    status: "live",
    local: true,
  },
  {
    slug: "media-download",
    name: "Media downloader",
    tagline: "Save videos and audio from a public link.",
    category: "media",
    status: "live",
    local: false,
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    tagline: "Format, validate, and minify JSON with syntax highlighting.",
    category: "code",
    status: "live",
    local: true,
  },
  {
    slug: "base64-encode",
    name: "Base64 Encode/Decode",
    tagline: "Encode text to Base64 or decode Base64 to text.",
    category: "encode",
    status: "live",
    local: true,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    tagline: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text or files.",
    category: "security",
    status: "live",
    local: true,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    tagline: "Generate UUIDs (v1, v4, v7) instantly with bulk option.",
    category: "generate",
    status: "live",
    local: true,
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    tagline: "Test and debug regular expressions with live highlighting.",
    category: "code",
    status: "live",
    local: true,
  },
  {
    slug: "color-palette",
    name: "Color Palette Generator",
    tagline: "Generate harmonious color palettes from a base color.",
    category: "color",
    status: "live",
    local: true,
  },
  {
    slug: "markdown-preview",
    name: "Markdown Preview",
    tagline: "Live preview Markdown with GitHub-flavored syntax.",
    category: "text",
    status: "live",
    local: true,
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    tagline: "Decode and inspect JSON Web Tokens without sending them anywhere.",
    category: "security",
    status: "live",
    local: true,
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    tagline: "Convert length, weight, temperature, area, volume, and more.",
    category: "calculator",
    status: "live",
    local: true,
  },
  {
    slug: "csv-to-json",
    name: "CSV to JSON",
    tagline: "Convert CSV data to JSON with configurable options.",
    category: "data",
    status: "live",
    local: true,
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    tagline: "Convert between Unix timestamps, ISO dates, and human formats.",
    category: "calculator",
    status: "live",
    local: true,
  },
  {
    slug: "image-resize",
    name: "Image Resizer",
    tagline: "Resize images by dimensions or percentage, preserve aspect ratio.",
    category: "image",
    status: "live",
    local: true,
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    tagline: "Generate placeholder text in paragraphs, words, or bytes.",
    category: "generate",
    status: "live",
    local: true,
  },
  {
    slug: "diff-checker",
    name: "Diff Checker",
    tagline: "Compare two texts side-by-side with inline differences.",
    category: "code",
    status: "live",
    local: true,
  },
];

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://toolhub.app";

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function toolsByCategory(): Record<ToolCategory, Tool[]> {
  const out = {} as Record<ToolCategory, Tool[]>;
  for (const t of tools) {
    (out[t.category] ||= []).push(t);
  }
  return out;
}
