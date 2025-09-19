import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

// Folder where your MDX case studies live
const CASE_STUDIES_PATH = path.join(process.cwd(), "src/case-studies");

type CaseStudyProps = {
  params: { slug: string };
};

export default async function CaseStudyPage({ params }: CaseStudyProps) {
  const { slug } = params;

  // Find the corresponding MDX file
  const filePath = path.join(CASE_STUDIES_PATH, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  // Read & parse the file
  const source = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(source);

  return (
    <article className="prose prose-invert mx-auto max-w-3xl py-12">
      <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
      {data.date && (
        <p className="text-sm text-gray-400 mb-8">Published: {data.date}</p>
      )}
      {/* Render MDX content */}
      <MDXRemote source={content} />
    </article>
  );
}

// Generate static routes for each case study
export async function generateStaticParams() {
  const files = fs.readdirSync(CASE_STUDIES_PATH);

  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => ({
      slug: file.replace(/\.mdx$/, ""),
    }));
}
