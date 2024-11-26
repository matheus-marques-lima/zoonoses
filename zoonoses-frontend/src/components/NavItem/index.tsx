import "./index.css";
import {usePathname} from "next/navigation";

export interface NavItemInterface {
    title: string;
    path: string;
    label: string;
}

export default function NavItem(props: NavItemInterface) {
    const pathname = usePathname();
    const current = props.path === '/' ? pathname === '/' : pathname.startsWith(props.path);

    return (
        <li className={`nav-item ${current ? "active" : ""}`}>
            <a href={props.path}>
                <h3>{props.title}</h3>
                <p>{props.label}</p>
            </a>
        </li>
    );
}