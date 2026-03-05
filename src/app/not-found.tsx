import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-emerald-400 text-sm font-bold tracking-widest mb-4">
        404
      </p>
      <h1 className="text-3xl font-bold text-white mb-2">
        ページが見つかりません
      </h1>
      <p className="text-white/50 mb-8">
        お探しのページは存在しないか、移動された可能性があります。
      </p>
      <Link
        href="/"
        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-[1.02]"
      >
        トップに戻る
      </Link>
    </div>
  );
}
