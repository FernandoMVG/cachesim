import React, { useState, useEffect, useContext } from 'react';
import { load_direct, store_direct, generate_random_string } from './Direct.js';
import { initCache, truncate_to_power_of_2 } from './CacheOperations';
import { HighlightContext } from './HighlightContext';

const CacheConfigForm = ({ cache, setCache, memory, setMemory }) => {
    const [cacheSize, setCacheSize] = useState('16');
    const [blockSize, setBlockSize] = useState('8');
    const [memorySize, setMemorySize] = useState('32');
    const [data, setData] = useState([]);
    const [address, setAddress] = useState([]);
    const [isCacheCreated, setIsCacheCreated] = useState(false);
    const [instructionType, setInstructionType] = useState('LOAD');
    const [mainMemory, setMainMemory] = useState([]);
    const [writePolicy, setWritePolicy] = useState('BACK');
    const [log, setLog] = useState('');
    const { setHighlightedAddress } = useContext(HighlightContext);

    useEffect(() => {
        console.log(cache);
    }, [cache]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const validCacheSize = truncate_to_power_of_2(cacheSize);
        const validBlockSize = truncate_to_power_of_2(blockSize);
        const validMemorySize = truncate_to_power_of_2(memorySize);

        setCacheSize(validCacheSize);
        setBlockSize(validBlockSize);
        setMemorySize(validMemorySize);

        const newCache = initCache(validCacheSize, validBlockSize);
        setCache(newCache);
        setIsCacheCreated(true);

        const initializedMemory = Array(validMemorySize).fill().map(() => generate_random_string((Math.floor(Math.random() * 8) + 3)));
        setMainMemory(initializedMemory);
        setMemory(initializedMemory);
        console.log(initializedMemory);
    };

    const nextButtonClick = () => {
        if (!isCacheCreated) {
            alert('Por favor, crea la tabla de caché primero.');
            return;
        }

        if (instructionType === 'STORE' && data.length !== address.length) {
            alert('La cantidad de datos y direcciones deben ser iguales para realizar una operación de STORE.');
            return;
        }

        if (address.length === 0) {
            alert('Todos los pasos completados. Carga nuevos elementos.');
            return;
        }

        const currentAddress = parseInt(address[0]);
        const currentData = instructionType === 'STORE' ? data[0] : null;

        let result;
        if (instructionType === 'LOAD') {
            result = load_direct(cache, currentAddress, 'BACK', cacheSize, blockSize, memorySize, mainMemory);
            setCache(result.cache);
            setMainMemory(result.mainMemory);
            setLog(prevLog => `${prevLog}\nLOAD: Address ${currentAddress} -> Data ${mainMemory[currentAddress]}\n${result.message}`);
        } else if (instructionType === 'STORE') {
            result = store_direct(cache, currentAddress, currentData, writePolicy, cacheSize, blockSize, memorySize, mainMemory);
            setCache(result.cache);
            setMainMemory(result.mainMemory);
            setMemory(result.mainMemory);
            setLog(prevLog => `${prevLog}\nSTORE: Address ${currentAddress} -> Data ${currentData}\n${result.message}`);
        }

        // Eliminar el primer elemento de data y address
        setData(data.slice(1));
        setAddress(address.slice(1));
        setHighlightedAddress(currentAddress);
    };

    const handleInstructionChange = (e) => {
        setInstructionType(e.target.value);
    };

    const handleWritePolicyChange = (e) => {
        setWritePolicy(e.target.value);
    };

    const handleReset = () => {
        setCache([]);
        setMemory([]);
        setCacheSize('');
        setBlockSize('');
        setMemorySize('');
        setData([]);
        setAddress([]);
        setIsCacheCreated(false);
        setInstructionType('LOAD');
        setMainMemory([]);
        setLog('');
    };

    const generateRandomDataAndAddresses = () => {
        const dataSize = 10; // You can adjust this size as needed
        const newAddresses = Array(dataSize).fill().map(() => Math.floor(Math.random() * memorySize).toString());
        setAddress(newAddresses);

        if (instructionType === 'STORE') {
            const newData = Array(dataSize).fill().map(() => generate_random_string(8));
            setData(newData);
        } else {
            setData([]); // Clear data if the instruction type is LOAD
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <div className="p-2 border rounded-md bg-white shadow-md">
                <h4 className="text-lg font-medium mb-1">Configuración</h4>
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Cache Size:
                        </label>
                        <input 
                            type="number" 
                            value={cacheSize} 
                            onChange={(e) => setCacheSize(parseInt(e.target.value))}
                            placeholder="Cache Size (power of 2)"
                            className="mt-1 p-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Block Size:
                        </label>
                        <input 
                            type="number" 
                            value={blockSize} 
                            onChange={(e) => setBlockSize(parseInt(e.target.value))}
                            placeholder="Block Size (power of 2)"
                            className="mt-1 p-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Memory Size:
                        </label>
                        <input 
                            type="number" 
                            value={memorySize} 
                            onChange={(e) => setMemorySize(parseInt(e.target.value))}
                            placeholder="Memory Size (power of 2)"
                            className="mt-1 p-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <div className="mt-2 flex justify-between">
                    <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded-md">Submit</button>
                    <button type="button" onClick={handleReset} className="px-3 py-1 bg-gray-500 text-white rounded-md">Reset</button>
                </div>
            </div>

            <div className="p-2 border rounded-md bg-white shadow-md">
                <h4 className="text-lg font-medium mb-1">Instrucciones</h4>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label htmlFor="instruction-select" className="block text-sm font-medium text-gray-700">Tipo:</label>
                        <select id="instruction-select" value={instructionType} onChange={handleInstructionChange} className="mt-1 block w-full p-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="LOAD">Load</option>
                            <option value="STORE">Store</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="data-input" className="block text-sm font-medium text-gray-700">Datos:</label>
                        <input 
                            type="text" 
                            id="data-input" 
                            value={data.join(',')} 
                            onChange={(e) => setData(e.target.value.split(','))} 
                            placeholder="Separados por coma"
                            disabled={instructionType === 'LOAD'}
                            className="mt-1 p-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="address-input" className="block text-sm font-medium text-gray-700">Dirección:</label>
                        <input 
                            type="text" 
                            id="address-input" 
                            value={address.join(',')} 
                            onChange={(e) => setAddress(e.target.value.split(','))} 
                            placeholder="Separados por coma"
                            className="mt-1 p-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mt-4 col-span-2">
                        <button type="button" onClick={generateRandomDataAndAddresses} className="px-3 py-1 bg-purple-500 text-white rounded-md w-full">Generar Aleatorios</button>
                    </div>
                </div>
            </div>

            <div className="p-2 border rounded-md bg-white shadow-md">
                <h4 className="text-lg font-medium mb-1">Política de Escritura</h4>
                <div>
                    <label htmlFor="write-policy-select" className="block text-sm font-medium text-gray-700">Política:</label>
                    <select id="write-policy-select" value={writePolicy} onChange={handleWritePolicyChange} className="mt-1 block w-full p-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="BACK">Write Back</option>
                        <option value="THROUGH">Write Through</option>
                    </select>
                </div>
            </div>

            <div className="mt-2 flex space-x-1">
                <button type="button" onClick={nextButtonClick} className="px-3 py-1 bg-yellow-500 text-white rounded-md">Next</button>
            </div>

            <textarea value={log} readOnly rows="5" cols="50" className="mt-2 w-full p-1 border border-gray-300 rounded-md" />
        </form>
    );
};

export default CacheConfigForm;
