import { AuthProvider } from "../lib/AuthContext";
import "./globals.css";

export const metadata = {
  title:       "memvigo — Memory Health Dashboard",
  description: "Real-time AI-powered memory fragmentation monitoring",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
