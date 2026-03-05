"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface FormulaResult {
  formula: string;
  explanation: string;
  examples: string[];
  category: string;
}

export default function FormulaGenerator() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<FormulaResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    const trimmed = query.trim();
    if (!trimmed) {
      toast.error("やりたいことを入力してください");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "生成に失敗しました");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.formula);
    toast.success("数式をコピーしました");
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例: A列の売上合計を求めたい、B列が「東京」の行だけC列を合計したい"
          className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none text-base"
          maxLength={500}
        />
        <Button
          onClick={handleGenerate}
          disabled={loading || !query.trim()}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-lg py-6 rounded-xl font-bold shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "生成中..." : "数式を生成"}
        </Button>
      </div>

      {result && (
        <div className="mt-8 animate-[fade-in-up_0.5s_ease-out]">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">
                {result.category}
              </span>
              <button
                onClick={handleCopy}
                className="text-white/40 hover:text-white text-xs transition-colors cursor-pointer"
              >
                コピー
              </button>
            </div>

            <div className="bg-black/50 border border-white/10 rounded-lg p-4 font-mono text-lg text-emerald-300 break-all select-all">
              {result.formula}
            </div>

            <div>
              <p className="text-white/40 text-xs mb-1 tracking-widest uppercase">説明</p>
              <p className="text-white/70 text-sm leading-relaxed">
                {result.explanation}
              </p>
            </div>

            {result.examples.length > 0 && (
              <div>
                <p className="text-white/40 text-xs mb-2 tracking-widest uppercase">使用例</p>
                <div className="space-y-2">
                  {result.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-sm text-white/60 font-mono"
                    >
                      {ex}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
