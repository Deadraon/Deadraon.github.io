import Link from "next/link";
import { tools, CATEGORY_LABEL, type Tool } from "@/lib/tools";

export function RelatedTools({ current }: { current: Tool }) {
  const related = tools
    .filter((t) => t.category === current.category && t.slug !== current.slug)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <nav aria-label="Related tools" className="mt-10">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 shrink-0">
          More {CATEGORY_LABEL[current.category]}
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>
      <ul>
        {related.map((t) => (
          <li key={t.slug} className="border-b border-white/[0.06] last:border-b-0">
            <Link
              href={`/tools/${t.slug}`}
              className="group flex items-baseline justify-between gap-4 py-3 hover:text-indigo-400 transition-colors"
            >
              <span className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors">
                {t.name}
              </span>
              <span className="text-xs text-[#4a5168] group-hover:text-[#8891a8] truncate text-right transition-colors">
                {t.tagline}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
