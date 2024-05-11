// App.js
import React, { useState } from 'react';
import CacheConfigForm from './components/CacheConfigForm';
import CacheTable from './components/CacheTable';

const App = () => {
  const [cache, setCache] = useState([]);
  console.log(cache)

  return (
    <div>
      <h1>Direct Mapped Cache Simulator</h1>
      <CacheConfigForm cache={cache} setCache={setCache} />
      <CacheTable data={cache} />
    </div>
  );
}

export default App;

