import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "这一餐",
  description: "快速决定这一餐吃什么、吃多少",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
