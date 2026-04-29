import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SILENTEC · Portal Mayorista",
  description: "Portal B2B mayorista SILENTEC — COARDEL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
