// MemoryTable.js
import React, { useEffect, useRef, useContext } from 'react';
import { HighlightContext } from './HighlightContext';

const MemoryTable = ({ data }) => {
    const tableRef = useRef(null);
    const { highlightedAddress } = useContext(HighlightContext);

    useEffect(() => {
        if (highlightedAddress !== null) {
            const row = tableRef.current.querySelector(`#memory-row-${highlightedAddress}`);
            if (row) {
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [highlightedAddress]);

    return (
        <div className="overflow-y-auto max-h-96 w-1/3" ref={tableRef}>
            <h2 className="text-lg font-semibold mb-2">Tabla de Memoria Principal</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={index}
                            id={`memory-row-${index}`}
                            className={`border-b border-gray-200 ${highlightedAddress === index ? 'bg-yellow-200' : ''}`}
                        >
                            <td className="p-2 text-center border-r border-gray-200 bg-blue-50">{index}</td>
                            <td className="p-2 text-center">{item}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MemoryTable;
