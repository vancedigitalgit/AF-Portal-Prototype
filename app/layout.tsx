import type { Metadata } from "next";
import "./globals.css";
import { ProductProvider } from "@/lib/ProductContext";
import { MessagesProvider } from "@/lib/MessagesContext";
import { FavouritesProvider } from "@/lib/FavouritesContext";

export const metadata: Metadata = {
  title: "Adlees Fresh — Business Portal",
  description: "Adlees Fresh business management portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <MessagesProvider>
          <FavouritesProvider>
            <ProductProvider>{children}</ProductProvider>
          </FavouritesProvider>
        </MessagesProvider>
      </body>
    </html>
  );
}
