// App.js
import React, { useState } from 'react';
import CacheConfigForm from './components/CacheConfigForm';
import CacheTable from './components/CacheTable';
import MemoryTable from './components/MemoryTable';

const App = () => {
  const [cache, setCache] = useState([]);
  const [memory, setMemory] = useState([]);
  console.log(cache)

  return (
    <div>
      <h1>Direct Mapped Cache Simulator</h1>
      <CacheConfigForm cache={cache} setCache={setCache}  memory={memory} setMemory={setMemory} />
      <CacheTable data={cache} />
      <MemoryTable data={memory} />
    </div>
  );
}

export default App;

