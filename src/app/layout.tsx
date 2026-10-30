import type { Metadata } from "next";
import { Cairo, Amiri } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "لحظة | من دعوة… إلى ذكرى - منصة دعوات المناسبات الفاخرة وتوثيق الذكريات",
  description:
    "أنشئ بطاقة دعوة زفاف رقمية مبهرة وشارك رمز الـ QR مع ضيوفك لجمع أجمل صور ولحظات ليلة العمر في ألبوم حي خالد.",
  keywords: ["دعوة زفاف", "كرت زواج", "دعوة إلكترونية", "توثيق ذكريات الزفاف", "لحظة", "QR زفاف"],
  openGraph: {
    title: "لحظة | من دعوة… إلى ذكرى",
    description: "شاركنا فرحتك واجمع أجمل لحظات ليلة العمر مع ضيوفك في ألبوم ذكريات تفاعلي.",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${amiri.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#FFF9F0] text-[#493B38] antialiased selection:bg-[#F27D72]/20 selection:text-[#51354F] font-sans">
        {children}
      </body>
    </html>
  );
}
