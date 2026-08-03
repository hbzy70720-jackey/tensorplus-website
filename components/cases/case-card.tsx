import Link from "next/link";
import { Calendar, Building2 } from "lucide-react";

interface CaseCardProps {
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  industry: string | null;
  customer: string | null;
  deliveryDate: string | null;
  tags: string;
}

const industryColors: Record<string, string> = {
  "光伏": "bg-yellow-50 text-yellow-700",
  "林业": "bg-green-50 text-green-700",
  "石油": "bg-orange-50 text-orange-700",
  "电力": "bg-blue-50 text-blue-700",
};

export default function CaseCard({
  title,
  slug,
  description,
  coverImage,
  industry,
  customer,
  deliveryDate,
  tags,
}: CaseCardProps) {
  const tagList: string[] = (() => {
    try {
      return JSON.parse(tags);
    } catch {
      return [];
    }
  })();

  return (
    <Link
      href={`/cases/${slug}`}
      className="group block rounded-2xl border border-gray-100 bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
    >
      {/* Cover Image */}
      <div className="aspect-video bg-gray-100 overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Industry + Tags */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {industry && (
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${industryColors[industry] || "bg-gray-50 text-gray-600"}`}>
              {industry}
            </span>
          )}
          {tagList.slice(0, 2).map((tag) => (
            <span key={tag} className="inline-block rounded-full bg-gray-50 px-2.5 py-0.5 text-xs text-gray-500">
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text-dark)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)] line-clamp-2">
            {description}
          </p>
        )}

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
          {customer && (
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {customer}
            </span>
          )}
          {deliveryDate && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {deliveryDate}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
