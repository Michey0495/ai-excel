import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AI Excel数式ジェネレーター";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #000000 0%, #064e3b 50%, #000000 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: "#34d399",
            fontWeight: 700,
            letterSpacing: "0.2em",
            marginBottom: 16,
          }}
        >
          {"// AI EXCEL FORMULA"}
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            background: "linear-gradient(90deg, #34d399, #2dd4bf, #22d3ee)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 24,
          }}
        >
          AI Excel数式ジェネレーター
        </div>
        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)" }}>
          自然言語からExcel数式を自動生成
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 16,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          ai-excel.ezoai.jp
        </div>
      </div>
    ),
    { ...size }
  );
}
