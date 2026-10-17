import type React from "react"
import type { Metadata } from "next"
import { Fraunces, JetBrains_Mono, Source_Sans_3 } from "next/font/google"
import { Analytics } from "@/components/analytics"
import { DemoBanner } from "@/components/demo/demo-banner"
import { SiteFooter } from "@/components/site-footer"
import "./globals.css"

// Shared with ANDA so the two products read as one ecosystem (brief §4).
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
})

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "NeuRafiki - Neurodivergent Self-Assessment",
  description: "Comprehensive neurodivergent self-assessment platform for African communities",
  openGraph: {
    title: "NeuRafiki - Neurodivergent Self-Assessment",
    description: "Comprehensive neurodivergent self-assessment platform for African communities",
    type: "website",
    siteName: "NeuRafiki",
    images: [{ url: "/apple-icon.png", width: 180, height: 180, alt: "NeuRafiki" }],
  },
  twitter: {
    card: "summary",
    title: "NeuRafiki - Neurodivergent Self-Assessment",
    description: "Comprehensive neurodivergent self-assessment platform for African communities",
    images: ["/apple-icon.png"],
  },
  generator: "v0.app",
}

// The per-request CSP nonce (middleware.ts) only reaches pages rendered per
// request, so nothing is prerendered at build time.
export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${fraunces.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="bg-background text-foreground font-sans antialiased">
        <DemoBanner />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  )
}
