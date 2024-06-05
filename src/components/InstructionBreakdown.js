// InstructionBreakdown.js
import React from 'react';

const InstructionBreakdown = ({ binAddress, tag, index, offset }) => {
    return (
        <div className="overflow-x-auto w-2/3">
            <h2 className="text-lg font-semibold mb-2">Instruction Breakdown</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="p-2 border border-gray-200 bg-gray-100">TAG</th>
                        <th className="p-2 border border-gray-200 bg-gray-100">INDEX</th>
                        <th className="p-2 border border-gray-200 bg-gray-100">OFFSET</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="p-2 text-center border border-gray-200">{tag}</td>
                        <td className="p-2 text-center border border-gray-200">{index}</td>
                        <td className="p-2 text-center border border-gray-200">{offset}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default InstructionBreakdown;
