// CacheTable.js
import React, { useEffect } from 'react';

const CacheTable = ({ data }) => {
    useEffect(() => {
        console.log('Data updated:', data);
    }, [data]);

    return (
        <div className="overflow-x-auto w-2/3">
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        {data.length > 0 && data[0].map((header, index) => (
                            <th key={index} className="p-2 border border-gray-200 bg-gray-100">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.slice(1).map((row, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="p-2 text-center border border-gray-200">
                                    {Array.isArray(cell) ? cell.join(', ') : cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CacheTable;
