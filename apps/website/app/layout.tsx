import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://nityagati.com"),
  title: {
    default: "Nityagati",
    template: "%s",
  },
  openGraph: {
    siteName: "Nityagati",
    images: ["/nityagati_logo_horizontal.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
