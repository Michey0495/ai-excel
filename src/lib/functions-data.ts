export interface FunctionData {
  slug: string;
  name: string;
  title: string;
  description: string;
  metaDescription: string;
  syntax: string;
  parameters: { name: string; desc: string }[];
  examples: { desc: string; formula: string }[];
  tips: string[];
  relatedFunctions: string[];
  category: string;
  faq: { q: string; a: string }[];
}

export const FUNCTIONS: FunctionData[] = [
  {
    slug: "vlookup",
    name: "VLOOKUP",
    title: "VLOOKUP関数の使い方 - 別シートからデータを検索・取得",
    description:
      "VLOOKUP関数は、指定した値をテーブルの左端列から検索し、同じ行の指定した列からデータを返す関数です。別シートからのデータ取得や、マスタデータとの照合に最もよく使われます。",
    metaDescription:
      "VLOOKUPの使い方を初心者向けに解説。別シートからのデータ取得、完全一致・近似一致の違い、エラー対処法まで。AIで数式を自動生成できます。",
    syntax: "=VLOOKUP(検索値, 範囲, 列番号, [検索方法])",
    parameters: [
      { name: "検索値", desc: "検索するセルまたは値" },
      { name: "範囲", desc: "データが含まれるテーブル範囲（検索値は左端列に必要）" },
      { name: "列番号", desc: "返す値がある列の番号（左から数えて）" },
      { name: "検索方法", desc: "FALSE=完全一致（推奨）、TRUE=近似一致" },
    ],
    examples: [
      { desc: "商品コードで商品名を検索", formula: '=VLOOKUP(A2,商品マスタ!A:C,2,FALSE)' },
      { desc: "社員番号から部署名を取得", formula: '=VLOOKUP(B2,社員一覧!A:D,4,FALSE)' },
      { desc: "エラー時に空白を返す", formula: '=IFERROR(VLOOKUP(A2,B:C,2,FALSE),"")' },
    ],
    tips: [
      "検索値は必ず範囲の左端列にある必要があります",
      "完全一致にはFALSEを指定（省略するとTRUE=近似一致になり意図しない結果に）",
      "IFERRORと組み合わせてエラーを回避するのが定番",
      "列番号のハードコーディングを避けたい場合はMATCH関数と組み合わせ",
    ],
    relatedFunctions: ["index-match", "xlookup", "hlookup"],
    category: "検索",
    faq: [
      {
        q: "VLOOKUPで別シートのデータを参照するには？",
        a: "範囲の指定でシート名を付けます。例: =VLOOKUP(A2,Sheet2!A:D,3,FALSE)",
      },
      {
        q: "VLOOKUPでN/Aエラーが出る原因は？",
        a: "検索値がテーブルに存在しない、データ型が違う（数値と文字列）、スペースが混入している等が主な原因です。",
      },
      {
        q: "VLOOKUPとINDEX MATCHどちらを使うべき？",
        a: "VLOOKUPは簡単ですが左端列しか検索できません。INDEX MATCHは柔軟性が高く、列の挿入にも強いため、複雑な参照にはINDEX MATCHがおすすめです。",
      },
    ],
  },
  {
    slug: "if",
    name: "IF",
    title: "IF関数の使い方 - 条件分岐で値を切り替える",
    description:
      "IF関数は、指定した条件が真か偽かを判定し、それぞれ異なる値を返す関数です。条件に応じた処理の分岐に使います。",
    metaDescription:
      "IF関数の使い方を解説。複数条件の書き方、ネストIF、IFS関数との違いまで。AIで複雑な条件分岐も日本語から自動生成。",
    syntax: "=IF(条件, 真の場合の値, 偽の場合の値)",
    parameters: [
      { name: "条件", desc: "TRUE/FALSEを返す論理式（例: A2>=100）" },
      { name: "真の場合", desc: "条件がTRUEのときに返す値" },
      { name: "偽の場合", desc: "条件がFALSEのときに返す値" },
    ],
    examples: [
      { desc: "80点以上なら合格", formula: '=IF(A2>=80,"合格","不合格")' },
      { desc: "空白チェック", formula: '=IF(A2="","未入力","入力済")' },
      { desc: "複数条件（AND）", formula: '=IF(AND(A2>=80,B2>=80),"合格","不合格")' },
      { desc: "ネストIF（3段階評価）", formula: '=IF(A2>=80,"A",IF(A2>=60,"B","C"))' },
    ],
    tips: [
      "複数条件にはAND/OR関数を組み合わせる",
      "3つ以上の分岐にはIFS関数の方がシンプル（Excel 2019以降）",
      "ネストは最大64段までだが、7段以上は可読性が悪いのでSWITCH等を検討",
      "空白判定は =IF(A2=\"\",...)  よりISBLANK(A2)が正確",
    ],
    relatedFunctions: ["ifs", "sumifs", "countif"],
    category: "条件分岐",
    faq: [
      {
        q: "IF関数で複数条件を指定するには？",
        a: "AND関数やOR関数と組み合わせます。例: =IF(AND(A2>=80,B2>=80),\"合格\",\"不合格\")",
      },
      {
        q: "IF関数のネストとは？",
        a: "IF関数の中にさらにIF関数を入れることです。3段階以上の分岐に使いますが、Excel 2019以降ならIFS関数の方がシンプルです。",
      },
    ],
  },
  {
    slug: "sumifs",
    name: "SUMIFS",
    title: "SUMIFS関数の使い方 - 複数条件で合計を求める",
    description:
      "SUMIFS関数は、複数の条件を満たすセルの合計値を求める関数です。売上集計や条件付き合計に広く使われます。",
    metaDescription:
      "SUMIFS関数の使い方を解説。複数条件の指定方法、日付範囲指定、SUMIFとの違いまで。AIで集計数式を自動生成。",
    syntax: "=SUMIFS(合計範囲, 条件範囲1, 条件1, [条件範囲2, 条件2], ...)",
    parameters: [
      { name: "合計範囲", desc: "合計したいセル範囲" },
      { name: "条件範囲1", desc: "条件をチェックするセル範囲" },
      { name: "条件1", desc: '条件（例: "東京", ">100"）' },
    ],
    examples: [
      { desc: "東京の売上合計", formula: '=SUMIFS(C:C,B:B,"東京")' },
      { desc: "東京かつ2024年の売上", formula: '=SUMIFS(C:C,B:B,"東京",D:D,">=2024/1/1")' },
      { desc: "100万以上の取引合計", formula: '=SUMIFS(C:C,C:C,">="&1000000)' },
    ],
    tips: [
      "SUMIFは条件1つ、SUMIFSは複数条件に対応",
      "条件に比較演算子を使う場合は文字列として指定: \">100\"",
      "セル参照を条件にする場合: \">=\"&E1",
      "ワイルドカード（*,?）も使用可能: \"東京*\"",
    ],
    relatedFunctions: ["countifs", "averageifs", "sumif"],
    category: "集計",
    faq: [
      {
        q: "SUMIFとSUMIFSの違いは？",
        a: "SUMIFは条件が1つだけ、SUMIFSは複数条件に対応。引数の順番も異なります。新規作成にはSUMIFSを推奨。",
      },
      {
        q: "日付範囲でSUMIFSを使うには？",
        a: '開始日と終了日を2つの条件で指定します。例: =SUMIFS(C:C,A:A,">="&DATE(2024,1,1),A:A,"<="&DATE(2024,12,31))',
      },
    ],
  },
  {
    slug: "index-match",
    name: "INDEX+MATCH",
    title: "INDEX MATCH関数の使い方 - VLOOKUPの上位互換",
    description:
      "INDEX関数とMATCH関数を組み合わせた検索手法です。VLOOKUPの制限（左端列のみ検索可能）を克服し、任意の方向にデータを検索できます。",
    metaDescription:
      "INDEX MATCHの使い方を解説。VLOOKUPとの違い、左方向検索、複数条件検索まで。AIで検索数式を自動生成。",
    syntax: "=INDEX(戻り値の範囲, MATCH(検索値, 検索範囲, 0))",
    parameters: [
      { name: "戻り値の範囲", desc: "結果を返す列の範囲" },
      { name: "検索値", desc: "検索する値" },
      { name: "検索範囲", desc: "検索値を探す列の範囲" },
      { name: "照合の種類", desc: "0=完全一致" },
    ],
    examples: [
      { desc: "商品名から価格を検索", formula: "=INDEX(C:C,MATCH(A2,B:B,0))" },
      { desc: "左方向の検索（VLOOKUPでは不可）", formula: "=INDEX(A:A,MATCH(D2,C:C,0))" },
      { desc: "エラー処理付き", formula: '=IFERROR(INDEX(C:C,MATCH(A2,B:B,0)),"見つかりません")' },
    ],
    tips: [
      "VLOOKUPと違い、検索列が左端でなくてもOK",
      "列の挿入・削除に強い（列番号のハードコーディングが不要）",
      "MATCH関数の第3引数は0（完全一致）が基本",
      "XLOOKUPが使える環境ならXLOOKUPの方がシンプル",
    ],
    relatedFunctions: ["vlookup", "xlookup", "hlookup"],
    category: "検索",
    faq: [
      {
        q: "INDEX MATCHとVLOOKUPどちらが良い？",
        a: "INDEX MATCHは柔軟性が高く、列の挿入にも強いため上級者向け。VLOOKUPは簡単だが左方向検索ができない制限があります。",
      },
    ],
  },
  {
    slug: "countif",
    name: "COUNTIF",
    title: "COUNTIF関数の使い方 - 条件に合うセルの個数を数える",
    description:
      "COUNTIF関数は、指定した条件を満たすセルの個数を数える関数です。データの件数集計や重複チェックに使います。",
    metaDescription:
      "COUNTIF関数の使い方を解説。複数条件のCOUNTIFS、重複チェック、空白以外のカウントまで。AIで集計数式を自動生成。",
    syntax: "=COUNTIF(範囲, 条件)",
    parameters: [
      { name: "範囲", desc: "カウント対象のセル範囲" },
      { name: "条件", desc: '条件（例: "東京", ">100", A2）' },
    ],
    examples: [
      { desc: "東京の件数", formula: '=COUNTIF(A:A,"東京")' },
      { desc: "100以上の件数", formula: '=COUNTIF(B:B,">="&100)' },
      { desc: "重複チェック", formula: "=COUNTIF(A:A,A2)>1" },
      { desc: "空白以外のカウント", formula: '=COUNTIF(A:A,"<>")' },
    ],
    tips: [
      "複数条件にはCOUNTIFS関数を使う",
      "ワイルドカード: *（任意の文字列）、?（任意の1文字）",
      "重複チェック: COUNTIF(列,セル)>1 で重複しているか判定",
      "空白セルのカウント: COUNTBLANK関数も使える",
    ],
    relatedFunctions: ["countifs", "sumif", "counta"],
    category: "集計",
    faq: [
      {
        q: "COUNTIFで複数条件を使うには？",
        a: "COUNTIFS関数を使います。例: =COUNTIFS(A:A,\"東京\",B:B,\">100\")",
      },
      {
        q: "重複データを見つけるには？",
        a: "=COUNTIF(A:A,A2)>1 を条件付き書式に設定すると、重複セルをハイライトできます。",
      },
    ],
  },
  {
    slug: "xlookup",
    name: "XLOOKUP",
    title: "XLOOKUP関数の使い方 - VLOOKUPの後継関数",
    description:
      "XLOOKUP関数はExcel 2021/Microsoft 365で追加された新しい検索関数です。VLOOKUPの制限を克服し、左右どちらの方向にも検索できます。",
    metaDescription:
      "XLOOKUP関数の使い方を解説。VLOOKUPとの違い、見つからない場合の処理、複数列の返却まで。AIで検索数式を自動生成。",
    syntax: "=XLOOKUP(検索値, 検索範囲, 戻り値の範囲, [見つからない場合], [一致モード], [検索モード])",
    parameters: [
      { name: "検索値", desc: "検索する値" },
      { name: "検索範囲", desc: "検索する列" },
      { name: "戻り値の範囲", desc: "結果を返す列" },
      { name: "見つからない場合", desc: "検索値が見つからない場合の戻り値（省略可）" },
      { name: "一致モード", desc: "0=完全一致（デフォルト）" },
    ],
    examples: [
      { desc: "基本的な検索", formula: "=XLOOKUP(A2,B:B,C:C)" },
      { desc: "見つからない場合のデフォルト値", formula: '=XLOOKUP(A2,B:B,C:C,"該当なし")' },
      { desc: "複数列を返す", formula: "=XLOOKUP(A2,B:B,C:E)" },
    ],
    tips: [
      "VLOOKUPと違い、デフォルトで完全一致（FALSEの指定不要）",
      "エラー時のデフォルト値を直接指定可能（IFERRORが不要）",
      "Excel 2021またはMicrosoft 365が必要（古いExcelでは使えない）",
      "Google スプレッドシートでも利用可能",
    ],
    relatedFunctions: ["vlookup", "index-match", "hlookup"],
    category: "検索",
    faq: [
      {
        q: "XLOOKUPはどのExcelで使える？",
        a: "Excel 2021、Microsoft 365、Google スプレッドシートで使えます。Excel 2019以前では使用不可。",
      },
    ],
  },
  {
    slug: "sumif",
    name: "SUMIF",
    title: "SUMIF関数の使い方 - 条件付きで合計を求める",
    description:
      "SUMIF関数は、指定した条件を満たすセルの合計を求める関数です。条件が1つの場合に使います。",
    metaDescription:
      "SUMIF関数の使い方を解説。条件の書き方、ワイルドカード、SUMIFSとの違いまで。AIで集計数式を自動生成。",
    syntax: "=SUMIF(条件範囲, 条件, [合計範囲])",
    parameters: [
      { name: "条件範囲", desc: "条件をチェックするセル範囲" },
      { name: "条件", desc: '条件（例: "東京", ">100"）' },
      { name: "合計範囲", desc: "合計する範囲（省略時は条件範囲が合計対象）" },
    ],
    examples: [
      { desc: "東京の売上合計", formula: '=SUMIF(A:A,"東京",B:B)' },
      { desc: "1000以上の値の合計", formula: '=SUMIF(B:B,">="&1000)' },
      { desc: "特定の文字を含む合計", formula: '=SUMIF(A:A,"*東京*",B:B)' },
    ],
    tips: [
      "条件が複数ある場合はSUMIFS関数を使う",
      "SUMIFは引数の順番がSUMIFSと異なるので注意",
      "合計範囲を省略すると、条件範囲自体の数値を合計",
    ],
    relatedFunctions: ["sumifs", "countif", "averageif"],
    category: "集計",
    faq: [
      {
        q: "SUMIFとSUMIFSの引数の順番は？",
        a: "SUMIF: (条件範囲, 条件, 合計範囲)。SUMIFS: (合計範囲, 条件範囲1, 条件1, ...)。順番が異なるので注意。",
      },
    ],
  },
  {
    slug: "ifs",
    name: "IFS",
    title: "IFS関数の使い方 - 複数条件の分岐をシンプルに",
    description:
      "IFS関数は、複数の条件を順番にチェックし、最初にTRUEになった条件の値を返す関数です。ネストしたIF関数をシンプルに書き直せます。",
    metaDescription:
      "IFS関数の使い方を解説。ネストIFとの比較、使用例、注意点まで。AIで条件分岐の数式を自動生成。",
    syntax: "=IFS(条件1, 値1, 条件2, 値2, ...)",
    parameters: [
      { name: "条件1", desc: "最初にチェックする論理式" },
      { name: "値1", desc: "条件1がTRUEのときに返す値" },
    ],
    examples: [
      { desc: "成績評価（A/B/C/D）", formula: '=IFS(A2>=90,"A",A2>=80,"B",A2>=70,"C",TRUE,"D")' },
      { desc: "区分判定", formula: '=IFS(B2>1000000,"大口",B2>100000,"中口",TRUE,"小口")' },
    ],
    tips: [
      "条件は上から順に評価され、最初にTRUEの値が返る",
      "「その他」の場合はTRUEを条件に使う: IFS(..., TRUE, \"その他\")",
      "Excel 2019以降、Microsoft 365、Google スプレッドシートで利用可能",
    ],
    relatedFunctions: ["if", "switch", "choose"],
    category: "条件分岐",
    faq: [
      {
        q: "IFS関数でelse（それ以外）を指定するには？",
        a: "最後の条件にTRUEを指定します。例: =IFS(A2>=80,\"合格\",TRUE,\"不合格\")",
      },
    ],
  },
];

export function getFunctionBySlug(slug: string): FunctionData | undefined {
  return FUNCTIONS.find((f) => f.slug === slug);
}

export function getAllSlugs(): string[] {
  return FUNCTIONS.map((f) => f.slug);
}
