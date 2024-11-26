import "./index.css";
import {ReactNode} from "react";

interface TableProps {
    titles: string[];
    values?: (string | number | ReactNode)[][];
}

export default function Table({titles, values = []}: TableProps) {
    return (
        <table className="table">
            <thead>
            <tr>
                {titles.map((title, index) => (
                    <th key={`cell-${index}`} className={`cell-${index}`}>{title}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {values.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                        <td key={`cell-${cellIndex}`} className={`cell-${cellIndex}`}>{cell}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}
