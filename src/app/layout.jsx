import { AuthProvider } from "../lib/AuthContext";
import "./globals.css";

export const metadata = {
  title:       "memvigo — Memory Health Dashboard",
  description: "Real-time AI-powered memory fragmentation monitoring",
};

import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
