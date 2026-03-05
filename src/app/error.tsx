"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-red-400 text-sm font-bold tracking-widest mb-4">
        ERROR
      </p>
      <h1 className="text-3xl font-bold text-white mb-2">
        エラーが発生しました
      </h1>
      <p className="text-white/50 mb-8">
        予期しないエラーが発生しました。もう一度お試しください。
      </p>
      <button
        onClick={reset}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
      >
        もう一度試す
      </button>
    </div>
  );
}
