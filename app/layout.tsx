import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { site } from "@/content/site";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Gabarito, JetBrains_Mono, Uncial_Antiqua } from "next/font/google";
import "./globals.css";

const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Gaelic-style lettering for one Irish detail in the footer. Not preloaded:
// it's below the fold, so it shouldn't compete with the fonts above it.
const uncialAntiqua = Uncial_Antiqua({
  variable: "--font-uncial",
  weight: "400",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s · Matheus Castilho" },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: site.locale,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // next-themes sets the "dark" class on <html> before React hydrates, so the
    // server and client class lists differ on purpose
    <html
      lang="en"
      suppressHydrationWarning
      className={`${gabarito.variable} ${jetBrainsMono.variable} ${uncialAntiqua.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
