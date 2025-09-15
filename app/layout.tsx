import type React from "react"
import type { Metadata } from "next"
import { Outfit, Fira_Code } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${outfit.variable} ${firaCode.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider defaultTheme="system" storageKey="tabler-app-theme">
            {children}
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}
