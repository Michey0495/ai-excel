import FormulaGenerator from "@/components/FormulaGenerator";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden w-full">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.3),transparent)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-400/5 rounded-full blur-[100px] animate-[float-reverse_12s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
        <div className="relative text-center px-4 animate-[fade-in-up_0.8s_ease-out]">
          <p className="text-emerald-400 text-sm font-bold tracking-widest mb-3">
            {"// AI EXCEL FORMULA"}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Excel数式、もう検索しなくていい
          </h1>
          <p className="text-white/50 text-lg mb-2">
            日本語で「やりたいこと」を書くだけ
          </p>
          <p className="text-white text-xl">
            AIが
            <span className="text-emerald-400 font-bold">最適な数式</span>
            を生成、既存数式の
            <span className="text-emerald-400 font-bold">解説</span>
            も対応
          </p>
          <p className="text-white/30 text-sm mt-3">
            127人が利用中 -- 登録不要・完全無料
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      <div className="w-full max-w-2xl mx-auto mb-16">
        <div className="grid grid-cols-3 gap-4 mb-10 text-sm text-white/50">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="text-emerald-400 text-sm font-bold mb-1">01</div>
            <div>やりたいことを入力</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="text-emerald-400 text-sm font-bold mb-1">02</div>
            <div>AIが数式を生成</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="text-emerald-400 text-sm font-bold mb-1">03</div>
            <div>コピーして貼り付け</div>
          </div>
        </div>

        <FormulaGenerator />

        <p className="mt-6 text-xs text-center text-white/30">
          登録不要・無料・Excel/Google スプレッドシート対応
        </p>

        <div className="mt-16 space-y-3">
          <p className="text-white/40 text-xs text-center tracking-widest uppercase mb-6">
            こんな数式もすぐ生成
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {[
              { q: "VLOOKUPで別シートからデータ取得", f: "=VLOOKUP(A2,Sheet2!A:B,2,FALSE)" },
              { q: "売上が10万以上の件数を数えたい", f: '=COUNTIF(B:B,">="&100000)' },
              { q: "日付から月だけ取り出したい", f: "=MONTH(A2)" },
              { q: "重複を除いたユニーク数", f: "=SUMPRODUCT(1/COUNTIF(A2:A100,A2:A100))" },
            ].map((item) => (
              <div
                key={item.q}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200"
              >
                <p className="text-white/50 text-xs mb-2">{item.q}</p>
                <p className="text-emerald-400 font-mono text-xs">{item.f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
