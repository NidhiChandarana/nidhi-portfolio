import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

const CASES_DIR = path.join(process.cwd(), "src/case-studies");

type Study = {
  slug: string;
  title: string;
  date?: string;
  summary?: string;
};

export default function CaseStudiesIndex() {
  const files = fs.existsSync(CASES_DIR)
    ? fs.readdirSync(CASES_DIR).filter((f) => f.endsWith(".mdx"))
    : [];

  const studies: Study[] = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(CASES_DIR, file), "utf8");
      const { data, content } = matter(raw);

      // Use frontmatter `summary` if provided; otherwise first non-empty line
      const summary =
        data.summary ||
        (content.split("\n").find((l: string) => l.trim().length > 0) || "")
          .slice(0, 220);

      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        summary,
      };
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <main className="min-h-screen bg-[#0B0F14] text-[#E6EEF5]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Case Studies</h1>
        <p className="text-[#9FB2C7] mb-8">
          Deep dives into systems I’ve built—architecture, trade-offs, and impact.
        </p>

        <ul className="space-y-4">
          {studies.map((s) => (
            <li
              key={s.slug}
              className="rounded-2xl border border-white/10 bg-[#10161D] hover:bg-[#131A22] transition"
            >
              <Link href={`/case-studies/${s.slug}`} className="block px-5 py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-lg font-medium text-teal-200 hover:underline">
                    {s.title}
                  </span>
                  {s.date && (
                    <span className="text-xs text-[#9FB2C7]">{s.date}</span>
                  )}
                </div>
                {s.summary && (
                  <p className="text-sm text-[#9FB2C7] mt-2 line-clamp-2">
                    {s.summary}
                  </p>
                )}
                <div className="text-xs text-[#9FB2C7] mt-2">Read case study →</div>
              </Link>
            </li>
          ))}

          {studies.length === 0 && (
            <li className="text-[#9FB2C7]">
              No case studies found. Add <code>*.mdx</code> files to{" "}
              <code>src/case-studies/</code>.
            </li>
          )}
        </ul>

        <div className="mt-10 text-sm">
          <Link href="/" className="text-teal-300 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
