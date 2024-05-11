// CacheTable.js
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

const CacheTable = ({ data }) => {


  useEffect(() => {
    
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
            {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CacheTable;
