import type { Metadata } from "next";
import Link from "next/link";
import { FUNCTIONS } from "@/lib/functions-data";

export const metadata: Metadata = {
  title: "Excel関数一覧 - 使い方とAI自動生成",
  description:
    "Excel/Google スプレッドシートの主要関数の使い方を解説。VLOOKUP、IF、SUMIFS、INDEX MATCH等。AIで数式を自動生成できます。",
  keywords: [
    "Excel関数 一覧",
    "Excel関数 使い方",
    "スプレッドシート 関数",
    "VLOOKUP",
    "IF関数",
    "SUMIFS",
    "Excel 数式",
  ],
  alternates: {
    canonical: "/functions",
  },
};

const categories = [
  { name: "検索", desc: "データの検索・照合" },
  { name: "集計", desc: "条件付き合計・カウント" },
  { name: "条件分岐", desc: "条件による値の切り替え" },
];

export default function FunctionsIndex() {
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-white/30 text-sm hover:text-white/50 transition-colors"
        >
          AI Excel数式ジェネレーター
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
          Excel関数一覧
        </h1>
        <p className="text-white/60 text-lg mb-10">
          主要なExcel/Google
          スプレッドシート関数の使い方をAI解説付きでまとめました
        </p>

        {categories.map((cat) => {
          const funcs = FUNCTIONS.filter((f) => f.category === cat.name);
          if (funcs.length === 0) return null;
          return (
            <section key={cat.name} className="mb-10">
              <h2 className="text-xl font-bold text-white mb-1">{cat.name}</h2>
              <p className="text-white/40 text-sm mb-4">{cat.desc}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {funcs.map((fn) => (
                  <Link
                    key={fn.slug}
                    href={`/functions/${fn.slug}`}
                    className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  >
                    <p className="text-emerald-400 font-mono font-bold text-lg">
                      {fn.name}
                    </p>
                    <p className="text-white/50 text-sm mt-1 line-clamp-2">
                      {fn.metaDescription}
                    </p>
                    <p className="text-white/30 text-xs mt-2">{fn.syntax}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <div className="mt-12 text-center bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">
            関数がわからなくても大丈夫
          </h2>
          <p className="text-white/50 text-sm mb-4">
            やりたいことを日本語で入力するだけで、AIが最適な数式を生成します
          </p>
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-[1.02]"
          >
            数式を生成する
          </Link>
        </div>
      </div>
    </div>
  );
}
