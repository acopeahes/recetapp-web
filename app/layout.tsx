import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import Encabezado from "./components/Encabezado";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RecetApp",
  description: "Tus recetas, con foto y en un solo lugar",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Encabezado />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-borde bg-crema">
          <div className="mx-auto max-w-6xl px-6 py-6 flex flex-wrap justify-between gap-3 text-sm text-gris">
            <span>RecetApp · Proyecto académico 2026</span>
            <span>Disponible en web y Android</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
