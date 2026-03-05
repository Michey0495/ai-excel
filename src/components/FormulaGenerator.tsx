"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface FormulaResult {
  formula: string;
  explanation: string;
  examples: string[];
  category: string;
}

interface ExplainResult {
  formula: string;
  explanation: string;
  functions_used: string[];
  tips: string;
}

interface HistoryEntry {
  query: string;
  formula: string;
  timestamp: number;
}

const EXAMPLE_QUERIES = [
  "A列の売上合計を求めたい",
  "B列が「東京」の行だけC列を合計",
  "日付から曜日を取得したい",
  "重複を除いた件数を数えたい",
];

const HISTORY_KEY = "ai-excel-history";
const MAX_HISTORY = 10;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
  } catch {
    // localStorage unavailable
  }
}

export default function FormulaGenerator() {
  const [mode, setMode] = useState<"generate" | "explain">("generate");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<FormulaResult | null>(null);
  const [explainResult, setExplainResult] = useState<ExplainResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addToHistory = useCallback((q: string, formula: string) => {
    const entry: HistoryEntry = { query: q, formula, timestamp: Date.now() };
    const updated = [entry, ...loadHistory().filter((h) => h.query !== q)].slice(0, MAX_HISTORY);
    saveHistory(updated);
    setHistory(updated);
  }, []);

  async function handleGenerate() {
    const trimmed = query.trim();
    if (!trimmed) {
      toast.error(mode === "generate" ? "やりたいことを入力してください" : "数式を入力してください");
      return;
    }

    setLoading(true);
    setResult(null);
    setExplainResult(null);

    try {
      if (mode === "generate") {
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
        addToHistory(trimmed, data.formula);
      } else {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formula: trimmed }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "解説に失敗しました");
        }

        const data = await res.json();
        setExplainResult(data);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).then(
      () => toast.success("コピーしました"),
      () => toast.error("コピーに失敗しました")
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  }

  function switchMode(newMode: "generate" | "explain") {
    setMode(newMode);
    setQuery("");
    setResult(null);
    setExplainResult(null);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
          <button
            onClick={() => switchMode("generate")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
              mode === "generate"
                ? "bg-emerald-600 text-white"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            数式を生成
          </button>
          <button
            onClick={() => switchMode("explain")}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
              mode === "explain"
                ? "bg-emerald-600 text-white"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            数式を解説
          </button>
        </div>

        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label={mode === "generate" ? "やりたいことを入力" : "数式を入力"}
          placeholder={
            mode === "generate"
              ? "例: A列の売上合計を求めたい、B列が「東京」の行だけC列を合計したい"
              : "例: =VLOOKUP(A2,Sheet2!A:B,2,FALSE)"
          }
          className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none text-base"
          maxLength={500}
        />

        {mode === "generate" && (
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((eq) => (
              <button
                key={eq}
                onClick={() => setQuery(eq)}
                className="text-xs text-white/40 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 hover:bg-white/10 hover:text-white/60 transition-all duration-200 cursor-pointer"
              >
                {eq}
              </button>
            ))}
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={loading || !query.trim()}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-lg py-6 rounded-xl font-bold shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading
            ? mode === "generate"
              ? "生成中..."
              : "解説中..."
            : mode === "generate"
              ? "数式を生成"
              : "数式を解説"}
        </Button>
        <p className="text-xs text-white/20 text-center">Ctrl + Enter でも実行できます</p>
      </div>

      {result && (
        <div className="mt-8 animate-[fade-in-up_0.5s_ease-out]">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">
                {result.category}
              </span>
              <button
                onClick={() => handleCopy(result.formula)}
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

      {explainResult && (
        <div className="mt-8 animate-[fade-in-up_0.5s_ease-out]">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">
                数式解説
              </span>
              <button
                onClick={() => handleCopy(explainResult.formula)}
                className="text-white/40 hover:text-white text-xs transition-colors cursor-pointer"
              >
                コピー
              </button>
            </div>

            <div className="bg-black/50 border border-white/10 rounded-lg p-4 font-mono text-lg text-emerald-300 break-all select-all">
              {explainResult.formula}
            </div>

            <div>
              <p className="text-white/40 text-xs mb-1 tracking-widest uppercase">解説</p>
              <p className="text-white/70 text-sm leading-relaxed">
                {explainResult.explanation}
              </p>
            </div>

            {explainResult.functions_used.length > 0 && (
              <div>
                <p className="text-white/40 text-xs mb-2 tracking-widest uppercase">使用関数</p>
                <div className="flex flex-wrap gap-2">
                  {explainResult.functions_used.map((fn) => (
                    <span
                      key={fn}
                      className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg px-3 py-1 text-xs font-mono"
                    >
                      {fn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {explainResult.tips && (
              <div>
                <p className="text-white/40 text-xs mb-1 tracking-widest uppercase">Tips</p>
                <p className="text-white/60 text-sm leading-relaxed">
                  {explainResult.tips}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-white/30 text-xs hover:text-white/50 transition-colors cursor-pointer"
          >
            {showHistory ? "履歴を閉じる" : `最近の生成履歴 (${history.length})`}
          </button>
          {showHistory && (
            <div className="mt-3 space-y-2 animate-[fade-in_0.3s_ease-out]">
              {history.map((h) => (
                <button
                  key={h.timestamp}
                  onClick={() => {
                    switchMode("generate");
                    setQuery(h.query);
                  }}
                  className="w-full text-left bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                >
                  <p className="text-white/50 text-xs truncate">{h.query}</p>
                  <p className="text-emerald-400/70 text-xs font-mono mt-1 truncate">
                    {h.formula}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
