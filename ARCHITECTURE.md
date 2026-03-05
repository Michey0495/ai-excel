# Architecture - AI Excel数式ジェネレーター

## 設計方針
- MVP: 「自然言語 → Excel数式」の1機能にフォーカス
- AI-First: MCP Server経由でAIエージェントが直接利用可能
- シンプル: データベース不要、ステートレスAPI

## ページ構成

| パス | 説明 | タイプ |
|------|------|--------|
| `/` | トップページ（数式生成フォーム） | Server + Client |

## API設計

### POST /api/generate
人間向けWebUIからの数式生成リクエスト。

**Request:**
```json
{ "query": "A列の売上合計を求めたい" }
```

**Response:**
```json
{
  "formula": "=SUM(A:A)",
  "explanation": "A列のすべての値を合計します",
  "examples": ["=SUM(A1:A100)"],
  "category": "集計"
}
```

### POST /api/mcp
MCP Server (JSON-RPC 2.0)。AIエージェント向け。

**Tools:**
1. `generate_formula` - 自然言語からExcel数式を生成
2. `explain_formula` - 既存数式を日本語で解説
3. `convert_formula` - Excel ↔ Google スプレッドシート変換

## コンポーネント構成

```
src/
  app/
    layout.tsx          # 共通レイアウト (SEO, GA, CrossPromo)
    page.tsx            # トップページ
    globals.css         # Tailwind + shadcn/ui
    robots.ts           # robots.txt生成
    opengraph-image.tsx # OGP画像生成
    api/
      generate/route.ts # 数式生成API
      mcp/route.ts      # MCP Server
  components/
    FormulaGenerator.tsx # 数式生成フォーム (Client)
    CrossPromo.tsx       # 他サービスへの誘導
    ui/                  # shadcn/ui コンポーネント
  lib/
    ai.ts               # AI呼び出し (Anthropic / Ollama)
    utils.ts             # shadcn/ui ユーティリティ
  public/
    .well-known/agent.json  # A2A Agent Card
    llms.txt                # AI向けサイト説明
```

## データフロー

```
[ユーザー] → FormulaGenerator → POST /api/generate → callAI() → JSON Response
[AIエージェント] → POST /api/mcp (JSON-RPC) → callAI() → JSON-RPC Response
```

## MCP Server設計

- Protocol: JSON-RPC 2.0 over HTTP POST
- Transport: Streamable HTTP (POST /api/mcp)
- Rate Limit: 10 req/10min/IP (Vercel KV or in-memory)
- Authentication: なし（レート制限で保護）

### MCP Methods
- `initialize` - サーバー情報を返す
- `tools/list` - 利用可能なツール一覧
- `tools/call` - ツール実行

## デプロイ
- Vercel にデプロイ
- ドメイン: ai-excel.ezoai.jp
- 環境変数: ANTHROPIC_API_KEY (必須)
