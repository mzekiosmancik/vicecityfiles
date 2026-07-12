import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import Script from "next/script";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/providers/cart-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { buildMetadata, JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "@/styles/globals.css";

const GTM_ID = "GTM-TLJTVN8F";

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
      <head>
        <Script id="gtm-head" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} font-sans`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
