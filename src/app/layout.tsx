
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"; // shadcn helper
import { ThemeProvider } from "@/components/theme-provider"; // Optional if using dark mode

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CareConnect",
  description: "Real-time remote healthcare powered by AI & IoT",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-slate-50 font-sans", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}