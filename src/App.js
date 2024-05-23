// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import CacheConfigForm from './components/CacheConfigForm';
import CacheTable from './components/CacheTable';
import MemoryTable from './components/MemoryTable';

const DirectMapped = () => {
  const [cache, setCache] = useState([]);
  const [memory, setMemory] = useState([]);

  return (
    <div>
      <h1>Direct Mapped Cache Simulator</h1>
      <CacheConfigForm cache={cache} setCache={setCache} memory={memory} setMemory={setMemory} />
      <CacheTable data={cache} />
      <MemoryTable data={memory} />
    </div>
  );
};

const FullyAssociative = () => {
  return <h1>Fully Associative Cache Simulator</h1>;
};

const SetAssociative = () => {
  return <h1>Set Associative Cache Simulator</h1>;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<DirectMapped />} />
        <Route path="/fully-associative" element={<FullyAssociative />} />
        <Route path="/set-associative" element={<SetAssociative />} />
      </Routes>
    </Router>
  );
};

export default App;


