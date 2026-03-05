import { NextRequest, NextResponse } from "next/server";
import { callAI, sanitizeInput } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = sanitizeInput(String(body.query || ""), 500);

    if (!query) {
      return NextResponse.json({ error: "queryは必須です" }, { status: 400 });
    }

    const prompt = buildFormulaPrompt(query);
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
      formula: parsed.formula ?? "",
      explanation: parsed.explanation ?? "",
      examples: Array.isArray(parsed.examples) ? parsed.examples.slice(0, 3) : [],
      category: parsed.category ?? "一般",
    });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "数式の生成に失敗しました" },
      { status: 500 }
    );
  }
}

export function buildFormulaPrompt(query: string): string {
  return `あなたはExcel/スプレッドシートの数式エキスパートです。
ユーザーの要望に最適なExcel数式を生成してください。

ユーザーの要望: ${query}

以下のJSON形式で回答してください。JSON以外のテキストは含めないでください。

{
  "formula": "生成した数式（例: =VLOOKUP(A2,B:C,2,FALSE)）",
  "explanation": "数式の説明（日本語、100文字以内）",
  "examples": ["使用例1", "使用例2"],
  "category": "カテゴリ（検索/集計/条件分岐/文字列/日付/数学/その他）"
}

注意:
- Excel/Google スプレッドシート両方で使える数式を優先
- 日本語関数名ではなく英語関数名を使用（SUM, IF, VLOOKUP等）
- 複雑な場合はネストせず、段階的に説明
- examplesは具体的なセル参照を含む実用例`;
}
