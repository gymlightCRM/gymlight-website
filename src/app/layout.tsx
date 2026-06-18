import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "짐라이트 GYMLIGHT | 서울 프리미엄 피트니스",
    template: "%s | GYMLIGHT",
  },
  description:
    "서울 6개 지점을 운영하는 프리미엄 피트니스 짐라이트. 지점 안내, 이벤트, 트레이너 채용.",
  metadataBase: new URL("https://gymlight.co.kr"),
  openGraph: {
    title: "짐라이트 GYMLIGHT",
    description: "BE THE LIGHT, GYM LIGHT. Base in Seoul.",
    siteName: "GYMLIGHT",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "짐라이트 GYMLIGHT",
      },
    ],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geist.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-black text-white antialiased">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
