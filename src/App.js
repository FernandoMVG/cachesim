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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Direct Mapped Cache Simulator</h1>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="md:w-1/4">
                    <CacheConfigForm cache={cache} setCache={setCache} memory={memory} setMemory={setMemory} />
                </div>
                <div className="md:w-3/4 flex gap-x-4">
                    <CacheTable data={cache} />
                    <MemoryTable data={memory} />
                </div>
            </div>
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
