import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/navbar";

const inter = Inter({

});

export const metadata = {
  title: "CSN - Drone Controller",
  description: "Drone controller webapp, made by CSN Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        {children}
      </body>
    </html>
  );
}
