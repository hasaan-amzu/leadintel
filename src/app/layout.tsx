import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadIntel — AI-Powered B2B Lead Research",
  description:
    "Upload your leads, get deep AI research on every prospect. Company intel, pain signals, LinkedIn activity — delivered to your inbox.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
