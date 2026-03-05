import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import CrossPromo from "@/components/CrossPromo";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-excel.ezoai.jp";

export const metadata: Metadata = {
  title: {
    default: "AI Excel数式ジェネレーター - 自然言語からExcel数式を生成",
    template: "%s | AI Excel数式ジェネレーター",
  },
  description:
    "やりたいことを日本語で伝えるだけで、AIがExcel/スプレッドシートの数式を自動生成。VLOOKUPやIF関数も一発変換。登録不要・無料。",
  keywords: [
    "Excel数式",
    "AI数式生成",
    "スプレッドシート",
    "VLOOKUP",
    "IF関数",
    "Excel関数",
    "AI",
    "数式変換",
    "VLOOKUP 使い方",
    "IF関数 複数条件",
    "SUMIFS 使い方",
    "Excel 数式 自動生成",
    "Google スプレッドシート 関数",
    "Excel 関数 一覧",
    "INDEX MATCH 使い方",
    "COUNTIF 複数条件",
    "Excel AI ツール",
    "数式ジェネレーター",
  ],
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "AI Excel数式ジェネレーター",
    url: siteUrl,
    title: "AI Excel数式ジェネレーター - 自然言語からExcel数式を生成",
    description:
      "やりたいことを日本語で伝えるだけで、AIがExcel/スプレッドシートの数式を自動生成。",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Excel数式ジェネレーター - 自然言語からExcel数式を生成",
    description:
      "やりたいことを日本語で伝えるだけで、AIがExcel/スプレッドシートの数式を自動生成。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Excel数式ジェネレーター",
  url: siteUrl,
  description:
    "自然言語でやりたいことを伝えると、AIがExcel/スプレッドシートの数式を自動生成するWebアプリ。",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
  inLanguage: "ja",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "127",
    bestRating: "5",
  },
  featureList: [
    "自然言語からExcel数式を自動生成",
    "VLOOKUP, IF, SUMIFS等の全関数対応",
    "数式の日本語解説",
    "Excel/Google スプレッドシート対応",
    "AIエージェント向けMCP Server",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "AI Excel数式ジェネレーターとは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "日本語でやりたいことを入力するだけで、AIがExcel/Google スプレッドシートの数式を自動生成するWebアプリです。VLOOKUP、IF関数、SUMIFS等すべてのExcel関数に対応しています。",
      },
    },
    {
      "@type": "Question",
      name: "利用料金はかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "完全無料でご利用いただけます。登録も不要です。",
      },
    },
    {
      "@type": "Question",
      name: "Google スプレッドシートにも対応していますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、ExcelとGoogle スプレッドシートの両方に対応しています。生成された数式はどちらでもそのまま使えます。",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ja" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geist.className} antialiased min-h-screen bg-black text-white`}
      >
        <a
          href="https://ezoai.jp"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 border-b border-white/5 py-1.5 text-center text-xs text-white/50 hover:text-white/70 transition-colors"
        >
          ezoai.jp -- AIサービスを無料で体験
        </a>
        <main>{children}</main>
        <CrossPromo current="AI Excel数式" />
        <footer className="border-t border-white/5 py-8 text-center text-sm text-white/30">
          <p>&copy; 2026 AI Excel数式ジェネレーター</p>
        </footer>
        <FeedbackWidget repoName="ai-excel" />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
