import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "DailyPlanner",
  description: "Modern AI destekli günlük planlayıcı uygulaması",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-lilac text-purple">{children}</body>
    </html>
  );
}
