import { NextRequest, NextResponse } from "next/server";
import { callAI, sanitizeInput } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const formula = sanitizeInput(String(body.formula || ""), 500);

    if (!formula) {
      return NextResponse.json({ error: "formulaは必須です" }, { status: 400 });
    }

    const prompt = `あなたはExcel数式の解説エキスパートです。
以下の数式を日本語で分かりやすく解説してください。

数式: ${formula}

以下のJSON形式で回答してください。JSON以外のテキストは含めないでください。

{
  "formula": "${formula}",
  "explanation": "数式の詳しい説明（日本語、200文字以内）",
  "functions_used": ["使用されている関数のリスト"],
  "tips": "この数式を使う際のコツや注意点（100文字以内）"
}`;

    const text = await callAI(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AIからの応答を解析できませんでした" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      formula: parsed.formula ?? formula,
      explanation: parsed.explanation ?? "",
      functions_used: Array.isArray(parsed.functions_used) ? parsed.functions_used : [],
      tips: parsed.tips ?? "",
    });
  } catch (err) {
    console.error("Explain error:", err);
    return NextResponse.json(
      { error: "数式の解説に失敗しました" },
      { status: 500 }
    );
  }
}
