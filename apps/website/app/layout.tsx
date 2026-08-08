import type { Metadata } from "next";
import "./globals.css";

// Placeholder metadata only -- real title/description copy is a later task.
export const metadata: Metadata = {
  title: "Nityagati",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
