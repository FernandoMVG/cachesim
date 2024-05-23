// CacheTable.js
import React, { useEffect } from 'react';

const CacheTable = ({ data }) => {
  useEffect(() => {
    console.log('Data updated:', data);
  }, [data]);

  return (
    <table>
      <thead>
        <tr>
          {data.length > 0 && data[0].map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(1).map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>
                {Array.isArray(cell) ? cell.join(', ') : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CacheTable;
