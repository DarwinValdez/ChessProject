import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { themeScript } from "@/components/layout/theme";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const description =
  "Academia interactiva de ajedrez: aperturas, medio juego, táctica y finales con seguimiento real del progreso.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Chess Academy", template: "%s · Chess Academy" },
  description,
  applicationName: "Chess Academy",
  openGraph: { type: "website", locale: "es_ES", siteName: "Chess Academy", title: "Chess Academy", description },
  twitter: { card: "summary", title: "Chess Academy", description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#161719" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
