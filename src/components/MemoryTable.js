// MemoryTable.js
import React from 'react';

const MemoryTable = ({ data }) => {
  return (
    <div className="scrollable-table" style={{ overflowY: 'auto', maxHeight: '400px' }}>
      <h2>Memory</h2>
      <table>
        <tbody>
          {Array.isArray(data[0]) ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    {Array.isArray(cell) ? cell.join(', ') : cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MemoryTable;
