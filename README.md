# AI Excel数式ジェネレーター

自然言語でやりたいことを伝えると、AIがExcel/Google スプレッドシートの数式を自動生成するWebアプリ。

## URL
https://ai-excel.ezoai.jp

## 技術スタック
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Anthropic Claude API (数式生成)
- Vercel (hosting)

## セットアップ

```bash
npm install
cp .env.example .env.local  # 環境変数を設定
npm run dev
```

## 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `ANTHROPIC_API_KEY` | Anthropic API キー | Yes |
| `NEXT_PUBLIC_SITE_URL` | サイトURL | No |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | No |
| `KV_REST_API_URL` | Vercel KV URL (レート制限用) | No |
| `KV_REST_API_TOKEN` | Vercel KV Token | No |

## 機能
- 自然言語からExcel数式を生成
- 数式の日本語解説
- Excel/Google スプレッドシート間の数式変換
- MCP Server (AIエージェント向けAPI)

## AI公開チャネル
- MCP Server: `/api/mcp`
- Agent Card: `/.well-known/agent.json`
- AI向け説明: `/llms.txt`

## 進捗

### Night 1 (完了)
- プロジェクト初期セットアップ
- コア機能: 自然言語 → Excel数式生成 (FormulaGenerator + /api/generate)
- MCP Server: generate_formula, explain_formula, convert_formula
- AI公開チャネル: llms.txt, agent.json, robots.txt
- SEO: メタデータ、構造化データ (JSON-LD)、OGP画像生成
- UI: ダークテーマ、エメラルドアクセント、CrossPromo
- Google Analytics対応

### Night 2 (完了)
- フィードバックウィジェット + /api/feedback (GitHub Issues連携)
- UX改善: サンプルクエリボタン、Ctrl+Enter対応
- agent.json に api_endpoints 追加

### 実装済み機能一覧
- [x] 自然言語からExcel数式を生成
- [x] 数式の日本語解説 (MCP)
- [x] Excel/Google スプレッドシート間変換 (MCP)
- [x] MCP Server (JSON-RPC 2.0)
- [x] AI公開チャネル (llms.txt, agent.json, robots.txt)
- [x] SEO (メタデータ、JSON-LD、OGP画像)
- [x] Google Analytics
- [x] レート制限 (Vercel KV / in-memory)
- [x] フィードバックウィジェット
- [x] サンプルクエリボタン
- [x] Ctrl+Enter ショートカット
