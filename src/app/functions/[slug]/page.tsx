import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { FUNCTIONS, getFunctionBySlug, getAllSlugs } from "@/lib/functions-data";
import FormulaGenerator from "@/components/FormulaGenerator";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fn = getFunctionBySlug(slug);
  if (!fn) return {};

  return {
    title: fn.title,
    description: fn.metaDescription,
    keywords: [
      fn.name,
      `${fn.name} 使い方`,
      `${fn.name} Excel`,
      `${fn.name} スプレッドシート`,
      `Excel ${fn.name}`,
      `${fn.name} 例`,
      `${fn.name} エラー`,
      "Excel関数",
      "AI数式生成",
    ],
    alternates: {
      canonical: `/functions/${fn.slug}`,
    },
    openGraph: {
      title: fn.title,
      description: fn.metaDescription,
      type: "article",
    },
  };
}

export default async function FunctionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fn = getFunctionBySlug(slug);
  if (!fn) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: fn.title,
    description: fn.metaDescription,
    author: { "@type": "Organization", name: "AI Excel数式ジェネレーター" },
    publisher: { "@type": "Organization", name: "ezoai.jp" },
    mainEntityOfPage: `https://ai-excel.ezoai.jp/functions/${fn.slug}`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: fn.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const related = FUNCTIONS.filter((f) =>
    fn.relatedFunctions.includes(f.slug)
  );

  return (
    <div className="min-h-screen px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-white/30 text-sm hover:text-white/50 transition-colors"
        >
          AI Excel数式ジェネレーター
        </Link>
        <span className="text-white/20 mx-2">/</span>
        <span className="text-white/40 text-sm">{fn.name}</span>

        <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
          {fn.title}
        </h1>

        <p className="text-white/60 text-lg leading-relaxed mb-8">
          {fn.description}
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">構文</h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 font-mono text-emerald-300 text-lg select-all">
            {fn.syntax}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">引数</h2>
          <div className="space-y-2">
            {fn.parameters.map((p) => (
              <div
                key={p.name}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4"
              >
                <span className="text-emerald-400 font-mono font-bold min-w-[120px]">
                  {p.name}
                </span>
                <span className="text-white/60">{p.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">使用例</h2>
          <div className="space-y-3">
            {fn.examples.map((ex, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <p className="text-white/50 text-sm mb-2">{ex.desc}</p>
                <p className="text-emerald-400 font-mono text-sm select-all">
                  {ex.formula}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-4">Tips</h2>
          <ul className="space-y-2">
            {fn.tips.map((tip, i) => (
              <li
                key={i}
                className="text-white/60 text-sm pl-4 border-l-2 border-emerald-500/30"
              >
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">
            よくある質問
          </h2>
          <div className="space-y-3">
            {fn.faq.map((item, i) => (
              <details
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl group"
              >
                <summary className="p-4 text-white/80 font-bold cursor-pointer hover:text-white transition-colors">
                  {item.q}
                </summary>
                <p className="px-4 pb-4 text-white/60 text-sm leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">
            {fn.name}関数をAIで自動生成
          </h2>
          <p className="text-white/50 text-sm mb-6">
            やりたいことを日本語で入力するだけで、最適な数式を生成します
          </p>
          <FormulaGenerator />
        </section>

        {related.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">
              関連する関数
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/functions/${r.slug}`}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                >
                  <p className="text-emerald-400 font-mono font-bold">
                    {r.name}
                  </p>
                  <p className="text-white/50 text-xs mt-1 line-clamp-2">
                    {r.metaDescription}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="text-center">
          <Link
            href="/"
            className="text-white/30 text-sm hover:text-white/50 transition-colors"
          >
            AI Excel数式ジェネレーターに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
