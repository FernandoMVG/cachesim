// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import CacheConfigForm from './components/CacheConfigForm';
import CacheTable from './components/CacheTable';
import MemoryTable from './components/MemoryTable';
import InstructionBreakdown from './components/InstructionBreakdown';
import InstructionBrkFully from './components/InstructionBrkFully'; 
import { HighlightProvider } from './components/HighlightContext';

const DirectMapped = () => {
    const [cache, setCache] = useState([]);
    const [memory, setMemory] = useState([]);
    const [segmentation, setSegmentation] = useState({ binAddress: '', tag: '', index: '', offset: '' });

    return (
        <HighlightProvider>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Direct Mapped Cache Simulator</h1>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="md:w-1/4">
                        <CacheConfigForm cache={cache} setCache={setCache} memory={memory} setMemory={setMemory} setSegmentation={setSegmentation} />
                    </div>
                    <div className="md:w-1/2 flex flex-col gap-y-4">
                        <InstructionBreakdown 
                            binAddress={segmentation.binAddress} 
                            tag={segmentation.tag} 
                            index={segmentation.index} 
                            offset={segmentation.offset} 
                        />
                        <CacheTable data={cache} />
                    </div>
                    <div className="md:w-1/4">
                        <MemoryTable data={memory} />
                    </div>
                </div>
            </div>
        </HighlightProvider>
    );
};

const FullyAssociative = () => {
    const [cache, setCache] = useState([]);
    const [memory, setMemory] = useState([]);
    const [segmentation, setSegmentation] = useState({ binAddress: '', tag: '', index: '', offset: '' });

    return (
        <HighlightProvider>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Fully Associative Cache Simulator</h1>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="md:w-1/4">
                        <CacheConfigForm cache={cache} setCache={setCache} memory={memory} setMemory={setMemory} setSegmentation={setSegmentation} />
                    </div>
                    <div className="md:w-2/4 flex flex-col gap-y-3">
                        <InstructionBrkFully
                            tag={segmentation.tag} 
                            offset={segmentation.offset} 
                        />
                        <CacheTable data={cache} />
                    </div>
                    <div className="md:w-1/4">
                        <MemoryTable data={memory} />
                    </div>
                </div>
            </div>
        </HighlightProvider>
    );
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
