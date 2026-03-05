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
