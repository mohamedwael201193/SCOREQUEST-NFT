import type React from "react"
import type { Metadata } from "next"
import { Orbitron, Inter } from "next/font/google"
import { Web3Provider } from "@/lib/web3-context"
import "./globals.css"

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-orbitron",
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "ScoreQuest NFT - Web3 Leaderboard Game",
  description:
    "A skill-based Web3 game where players earn points, compete on leaderboards, and mint NFT rewards on Monad Testnet",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-sans: ${inter.variable};
  --font-display: ${orbitron.variable};
}
        `}</style>
      </head>
      <body className={`${orbitron.variable} ${inter.variable} antialiased`}>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  )
}
