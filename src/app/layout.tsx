import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/providers/cart-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { buildMetadata, JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "@/styles/globals.css";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const fontDisplay = Orbitron({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const fontMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  ...buildMetadata(),
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://vicecityfiles.com"),
};

export const viewport: Viewport = {
  themeColor: "#07060b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} font-sans`}>
        <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
        <ThemeProvider>
          <CartProvider>
            <Navbar />
            <main id="main" className="min-h-screen">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
