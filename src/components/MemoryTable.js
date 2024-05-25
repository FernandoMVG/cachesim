// MemoryTable.js
import React, { useEffect } from 'react';

const MemoryTable = ({ data }) => {
    useEffect(() => {
        console.log('Memory Table updated:', data);
    }, [data]);

    return (
        <div className="overflow-y-auto max-h-96 w-1/3">
            <h2 className="text-lg font-semibold mb-2">Memory</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                            <td className="p-2 text-center">{item}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MemoryTable;
