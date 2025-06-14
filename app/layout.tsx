import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = "https://www.guesshigher.com";

export const metadata = {
  title: "Guess Higher",
  description:
    "Test your knowledge with Guess Higher! Compare car prices, city populations, food calories & more. Fun, fast-paced, and addictive. Play now and challenge your friends!",
  openGraph: {
    title: "Guess Higher",
    description:
      "Play Guess Higher and test your knowledge! Guess which item has a higher value across topics like cars, cities, food & more. Fun and addictive quiz game!",
    url: "https://www.guesshigher.com",
    siteName: "Guess Higher",
    images: [
      {
        url: `${baseUrl}/landing.png`,
        width: 1200,
        height: 630,
        alt: "Guess Higher - Comparison Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guess Higher | Challenge Your Knowledge",
    description:
      "Can you guess which one is higher? Play Guess Higher — compare values from cars, cities, food & more. Fun, educational, and addictive!",
    images: [`${baseUrl}/landing.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
