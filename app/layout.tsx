"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import Navbar from "@/components/Navbar";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <title>WebRe.live</title>
      <link rel="icon" href="/svg/logo.svg" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ paddingTop: "64px" }}
      >
        <PrivyProvider
          appId="cm39uwxau049p146edd5b7bjb"
          config={{
            appearance: {
              theme: "dark",
              accentColor: "#676FFF",
            },
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
          }}
        >
          <Navbar />
          {children}
        </PrivyProvider>
      </body>
    </html>
  );
}
