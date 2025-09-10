import { GeistSans } from "geist/font/sans";
import { SelectionProvider } from "@/contexts/SelectionContext";
import "./globals.css";

export const metadata = {
  title: "Document Intelligence - MongoDB",
  description: "AI-Powered Document Analysis & Comparison",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <SelectionProvider>
          {children}
        </SelectionProvider>
      </body>
    </html>
  );
}
