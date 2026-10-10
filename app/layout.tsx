import type { Metadata, Viewport } from "next";
import { Manrope, Unbounded } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "LI MOTORS — импорт автомобилей из Кореи, Китая и Японии",
  description:
    "Подбор, проверка и доставка автомобилей из Кореи, Китая и Японии. Цена известна до оплаты, каждый этап сделки виден заранее.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080a0e" },
    { media: "(prefers-color-scheme: light)", color: "#f3f5f8" },
  ],
};

// Sets the theme before first paint so the page never flashes the wrong colours.
const themeScript = `try{var t=localStorage.getItem('limotors-theme')||'dark';if(t==='system')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      data-theme="dark"
      suppressHydrationWarning
      className={`${unbounded.variable} ${manrope.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
