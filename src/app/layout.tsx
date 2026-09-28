import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgroDrones Tech",
  description: "AgroDrone Tech is a leading provider of agricultural drone technology, revolutionizing farming with cutting-edge solutions. Our mission is to make farming smarter, faster, and more efficient.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
