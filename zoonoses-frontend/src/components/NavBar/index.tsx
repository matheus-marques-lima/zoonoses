"use client";

import "./index.css";

import Link from "next/link";
import Image from "next/image";
import NavItem, {NavItemInterface} from "@/components/NavItem";
import {useState} from "react";
import {FaBars} from "react-icons/fa"

import logo from "../../../public/logo.png";

export default function NavBar() {
    const items: NavItemInterface[] = [
        {
            title: "Início",
            path: "/",
            label: "Página inicial",
        },
        {
            title: "Animais",
            path: "/pets",
            label: "Ver registro",
        },
        {
            title: "Portal",
            path: "/admin",
            label: "Acesso institucional",
        },
    ];

    const [mobile, setMobile] = useState<boolean>(false);

    return (
        <header>
            <nav className="navbar">
                <Link href="/" className="nav-logo">
                    <Image
                        src={logo}
                        alt="Logo do sistema"
                        width={250}
                        height={70}
                    />
                </Link>

                <ul className={`nav-items ${mobile ? "open" : ""}`}>
                    {items.map((item, index) => (
                        <NavItem
                            key={index}
                            path={item.path}
                            title={item.title}
                            label={item.label}
                        />
                    ))}
                </ul>

                <button className="nav-mobile" onClick={() => setMobile(!mobile)}>
                    <FaBars/>
                </button>
            </nav>
        </header>
    );
}