import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Hearder";
import BackToTop from "@/components/layout/BackToTop";

export const metadata: Metadata = {
  title: "Sakura",
  description: "Sakura Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
          {children}
          <BackToTop />
        <Footer />
      </body>
    </html>
  );
}