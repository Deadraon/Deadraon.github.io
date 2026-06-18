import { notFound } from "next/navigation";
import { getTool, tools, SITE_URL } from "@/lib/tools";
import { ToolShell } from "@/components/ToolShell";
import { ToolRenderer } from "@/components/tools/ToolRenderer";

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolShell tool={tool}>
        <ToolRenderer slug={tool.slug} name={tool.name} />
      </ToolShell>
    </>
  );
}
