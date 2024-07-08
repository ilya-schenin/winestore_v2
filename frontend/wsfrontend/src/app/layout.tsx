"use client";

// import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header/Header";
import { AuthModal } from "@/components/Auth/AuthModal";
import { Provider } from 'react-redux';
import store from "../../redux-toolkit/store";


const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '500', '700'] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={montserrat.className}>
        <Provider store={store}>
          <AuthModal />
          <div className="container">
            <Header />
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
