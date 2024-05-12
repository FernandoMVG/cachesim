// CacheTable.js
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';



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
              {/* Check if cell is an array and join its values into a single string */}
              
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
