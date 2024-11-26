import type {Metadata} from "next";
import {Poppins} from "next/font/google";
import React from "react";
import "./styles.css";
import Navbar from "../components/NavBar";
import {UserWrapper} from "@/context/user.context";

export const metadata: Metadata = {
    title: "Prefeitura de Fortaleza",
};

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br">
        <body className={poppins.className}>
        <UserWrapper>
            <Navbar/>
            {children}
        </UserWrapper>
        </body>
        </html>
    );
}
