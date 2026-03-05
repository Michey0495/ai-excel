import { NextRequest, NextResponse } from "next/server";
import { callAI, sanitizeInput } from "@/lib/ai";
import { buildFormulaPrompt } from "@/app/api/generate/route";

const RATE_LIMIT = 10;
const RATE_WINDOW_SEC = 600;
const memRateMap = new Map<string, { count: number; resetAt: number }>();

async function isRateLimited(ip: string): Promise<boolean> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { kv } = await import("@vercel/kv");
      const key = `ratelimit:excel:mcp:${ip}`;
      const count = await kv.incr(key);
      if (count === 1) {
        await kv.expire(key, RATE_WINDOW_SEC);
      }
      return count > RATE_LIMIT;
    }
  } catch {
    // Fall through
  }
  const now = Date.now();
  const entry = memRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    memRateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_SEC * 1000 });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

const TOOLS = [
  {
    name: "generate_formula",
    description:
      "自然言語の説明からExcel/スプレッドシートの数式を生成します。やりたいことを日本語または英語で入力してください。",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string" as const,
          description:
            "やりたいことの説明（例: A列の売上合計を求めたい、B列が東京の行だけC列を合計したい）",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "explain_formula",
    description:
      "既存のExcel数式を日本語で解説します。数式を入力すると、何をしているか分かりやすく説明します。",
    inputSchema: {
      type: "object" as const,
      properties: {
        formula: {
          type: "string" as const,
          description: "解説してほしいExcel数式（例: =VLOOKUP(A2,B:C,2,FALSE)）",
        },
      },
      required: ["formula"],
    },
  },
  {
    name: "convert_formula",
    description:
      "Excel数式をGoogle スプレッドシート用に変換、またはその逆を行います。",
    inputSchema: {
      type: "object" as const,
      properties: {
        formula: {
          type: "string" as const,
          description: "変換したい数式",
        },
        target: {
          type: "string" as const,
          enum: ["excel", "google_sheets"],
          description: "変換先（excel または google_sheets）",
        },
      },
      required: ["formula", "target"],
    },
  },
];

async function handleGenerateFormula(query: string) {
  const prompt = buildFormulaPrompt(query);
  const text = await callAI(prompt);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI応答からJSONを抽出できませんでした");
  return JSON.parse(jsonMatch[0]);
}

async function handleExplainFormula(formula: string) {
  const escapedFormula = formula.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const prompt = `あなたはExcel数式の解説エキスパートです。
以下の数式を日本語で分かりやすく解説してください。

数式: ${formula}

以下のJSON形式で回答してください。JSON以外のテキストは含めないでください。

{
  "formula": "${escapedFormula}",
  "explanation": "数式の詳しい説明（日本語）",
  "functions_used": ["使用されている関数のリスト"],
  "tips": "この数式を使う際のコツや注意点"
}`;
  const text = await callAI(prompt);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI応答からJSONを抽出できませんでした");
  return JSON.parse(jsonMatch[0]);
}

async function handleConvertFormula(formula: string, target: string) {
  const targetName = target === "excel" ? "Excel" : "Google スプレッドシート";
  const escapedFormula = formula.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const prompt = `あなたはExcelとGoogle スプレッドシートの数式エキスパートです。
以下の数式を${targetName}用に変換してください。

元の数式: ${formula}
変換先: ${targetName}

以下のJSON形式で回答してください。JSON以外のテキストは含めないでください。

{
  "original": "${escapedFormula}",
  "converted": "変換後の数式",
  "target": "${target}",
  "notes": "変換時の注意点（差異がない場合はその旨記載）"
}`;
  const text = await callAI(prompt);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI応答からJSONを抽出できませんでした");
  return JSON.parse(jsonMatch[0]);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, id: requestId, params } = body;

    switch (method) {
      case "tools/list": {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          result: { tools: TOOLS },
        });
      }

      case "tools/call": {
        const ip =
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        if (await isRateLimited(ip)) {
          return NextResponse.json({
            jsonrpc: "2.0",
            id: requestId ?? null,
            error: { code: -32000, message: "Rate limit exceeded. Try again later." },
          });
        }

        const toolName = params?.name;
        const toolArgs = params?.arguments;

        switch (toolName) {
          case "generate_formula": {
            if (!toolArgs?.query) {
              return NextResponse.json({
                jsonrpc: "2.0",
                id: requestId ?? null,
                error: { code: -32602, message: "Invalid params: query is required" },
              });
            }
            const result = await handleGenerateFormula(
              sanitizeInput(String(toolArgs.query), 500)
            );
            return NextResponse.json({
              jsonrpc: "2.0",
              id: requestId ?? null,
              result: {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
              },
            });
          }

          case "explain_formula": {
            if (!toolArgs?.formula) {
              return NextResponse.json({
                jsonrpc: "2.0",
                id: requestId ?? null,
                error: { code: -32602, message: "Invalid params: formula is required" },
              });
            }
            const result = await handleExplainFormula(
              sanitizeInput(String(toolArgs.formula), 500)
            );
            return NextResponse.json({
              jsonrpc: "2.0",
              id: requestId ?? null,
              result: {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
              },
            });
          }

          case "convert_formula": {
            if (!toolArgs?.formula || !toolArgs?.target) {
              return NextResponse.json({
                jsonrpc: "2.0",
                id: requestId ?? null,
                error: {
                  code: -32602,
                  message: "Invalid params: formula and target are required",
                },
              });
            }
            const result = await handleConvertFormula(
              sanitizeInput(String(toolArgs.formula), 500),
              toolArgs.target === "google_sheets" ? "google_sheets" : "excel"
            );
            return NextResponse.json({
              jsonrpc: "2.0",
              id: requestId ?? null,
              result: {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
              },
            });
          }

          default:
            return NextResponse.json({
              jsonrpc: "2.0",
              id: requestId ?? null,
              error: { code: -32601, message: `Unknown tool: ${toolName}` },
            });
        }
      }

      case "initialize": {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "ai-excel", version: "0.1.0" },
          },
        });
      }

      default:
        return NextResponse.json({
          jsonrpc: "2.0",
          id: requestId ?? null,
          error: { code: -32601, message: `Method not found: ${method}` },
        });
    }
  } catch (err) {
    console.error("MCP error:", err);
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32603, message: "Internal error" },
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "ai-excel",
    version: "0.1.0",
    description:
      "AI Excel数式ジェネレーター MCP Server - 自然言語からExcel/スプレッドシートの数式を生成。数式の解説・変換も可能。",
    tools: TOOLS,
    endpoints: {
      mcp: "/api/mcp",
      generate: "/api/generate",
    },
  });
}
