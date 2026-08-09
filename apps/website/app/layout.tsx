import type { Metadata } from "next";
import { Aldrich } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Self-hosted at build time via next/font -- static-export compatible, no
// runtime request to Google Fonts. Exposed only as a CSS variable; used
// nowhere by default. Scoped exclusively to the "Nityagati" wordmark via
// Logo.module.css -- every other typeface on the site is untouched.
const aldrich = Aldrich({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-aldrich",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nityagati.com"),
  title: {
    default: "Nityagati",
    template: "%s",
  },
  openGraph: {
    siteName: "Nityagati",
    images: ["/nityagati_logo_primary_navyblue.png"],
  },
  icons: {
    // Two favicons, switched by the browser/OS theme -- the navy-badge
    // logo disappears against a dark tab bar, so dark theme gets the
    // inverted (white badge/navy N) asset instead. Light-theme entry is
    // listed first as the fallback for browsers that ignore `media` on
    // favicon links.
    icon: [
      { url: "/nityagati_logo.svg", media: "(prefers-color-scheme: light)" },
      { url: "/nityagati_logo_inverted.svg", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={aldrich.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
