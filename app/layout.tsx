import type { Metadata, Viewport } from "next";
import { Dela_Gothic_One, Golos_Text, Rubik_Wet_Paint } from "next/font/google";
import { BookingSheet } from "@/components/booking";
import { Header } from "@/components/header";
import { Footer } from "@/components/info";
import { MobileBar } from "@/components/mobile-bar";
import { OrderProvider } from "@/components/order-context";
import "./globals.css";

const dela = Dela_Gothic_One({
  variable: "--font-dela",
  subsets: ["latin", "cyrillic"],
  weight: "400",
});

const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

// Только для логотипа: рваные «потёки» как у надписи на их вывеске
const wetPaint = Rubik_Wet_Paint({
  variable: "--font-wet",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "WSM Garage — порошковая покраска дисков в Сысерти",
  description:
    "Реставрация и порошковая покраска дисков, суппортов и металлических деталей. Комплект от 7 000 ₽, цвет по каталогу RAL. Сысерть, ул. Калинина, 16А.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${dela.variable} ${golos.variable} ${wetPaint.variable} antialiased`}>
      <body className="min-h-dvh">
        <OrderProvider>
          <Header />
          {children}
          <Footer />
          <MobileBar />
          <BookingSheet />
        </OrderProvider>
      </body>
    </html>
  );
}
