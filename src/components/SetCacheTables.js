// SetAssociativeCacheTables.js
import React from 'react';
import CacheTable from './CacheTable';

const SetCacheTables = ({ caches }) => {
  return (
    <div>
      {caches.map((cache, index) => (
        <div key={index}>
          <h3 className="text-lg font-semibold mb-2">Set {index}</h3>
          <CacheTable data={cache} />
        </div>
      ))}
    </div>
  );
};

export default SetCacheTables;
