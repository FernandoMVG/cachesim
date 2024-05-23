
import { useEffect, useState } from 'react';
import { load_direct, store_direct, generate_random_string } from './Direct.js';
import { initCache, truncate_to_power_of_2 } from './CacheOperations';

const CacheConfigForm = ({ cache, setCache, memory, setMemory }) => {
  const [cacheSize, setCacheSize] = useState('');
  const [blockSize, setBlockSize] = useState('');
  const [memorySize, setMemorySize] = useState('');
  const [data, setData] = useState([]);
  const [address, setAddress] = useState([]);
  const [isCacheCreated, setIsCacheCreated] = useState(false);
  const [instructionType, setInstructionType] = useState('LOAD');
  const [currentStep, setCurrentStep] = useState(0);
  const [mainMemory, setMainMemory] = useState([]);
  const [writePolicy, setWritePolicy] = useState('BACK');
  const [log, setLog] = useState(''); // Nuevo estado para mantener el log

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

  const handleLoadData = () => {
    setCurrentStep(0);
  };

  const nextButtonClick = () => {
    if (!isCacheCreated) {
      alert('Por favor, crea la tabla de caché primero.');
      return;
    }

    if (currentStep >= address.length) {
      alert('Todos los pasos completados. Carga nuevos elementos.');
      return;
    }

    const currentAddress = parseInt(address[currentStep]);
    const currentData = instructionType === 'STORE' ? data[currentStep] : null;
    let result;

    if (instructionType === 'LOAD') {
      result = load_direct(cache, currentAddress, 'BACK', cacheSize, blockSize, memorySize, mainMemory);
    } else if (instructionType === 'STORE') {
      result = store_direct(cache, currentAddress, currentData, writePolicy, cacheSize, blockSize, memorySize, mainMemory);
    }

    setCache(result);
    setLog((prevLog) => `${prevLog}\n${result.join(' ')}`); // Actualiza el log

    setCurrentStep(currentStep + 1);
  };

  const fastForwardButtonClick = () => {
    if (!isCacheCreated) {
      alert('Por favor, crea la tabla de caché primero.');
      return;
    }

    for (let step = currentStep; step < address.length; step++) {
      const currentAddress = parseInt(address[step]);
      const currentData = instructionType === 'STORE' ? data[step] : null;
      let result;

      if (instructionType === 'LOAD') {
        result = load_direct(cache, currentAddress, 'BACK', cacheSize, blockSize, memorySize, mainMemory);
      } else if (instructionType === 'STORE') {
        result = store_direct(cache, currentAddress, currentData, writePolicy, cacheSize, blockSize, memorySize, mainMemory);
      }

      setCache(result);
      setLog((prevLog) => `${prevLog}\n${result.join(' ')}`); // Actualiza el log
    }

    setCurrentStep(address.length);
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
    setCurrentStep(0);
    setMainMemory([]);
    setLog(''); // Reinicia el log
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Cache Size:
        <input 
          type="number" 
          value={cacheSize} 
          onChange={(e) => setCacheSize(parseInt(e.target.value))}
          placeholder="Cache Size (power of 2)"
        />
      </label>
      <label>
        Block Size:
        <input 
          type="number" 
          value={blockSize} 
          onChange={(e) => setBlockSize(parseInt(e.target.value))}
          placeholder="Block Size (power of 2)"
        />
      </label>
      <label>
        Memory Size:
        <input 
          type="number" 
          value={memorySize} 
          onChange={(e) => setMemorySize(parseInt(e.target.value))}
          placeholder="Memory Size (power of 2)"
        />
      </label>
      <button type="submit">Submit</button>

      <div className="instruction-type">
        <h4>Tipo de Instrucciones</h4>
        <label htmlFor="instruction-select">Tipo:</label>
        <select id="instruction-select" value={instructionType} onChange={handleInstructionChange}>
          <option value="LOAD">Load</option>
          <option value="STORE">Store</option>
        </select>
      </div>
      <div className="instruction-data">
        <label htmlFor="data-input">Datos:</label>
        <input 
          type="text" 
          id="data-input" 
          value={data.join(',')} 
          onChange={(e) => setData(e.target.value.split(','))} 
          placeholder="Separados por coma"
          disabled={instructionType === 'LOAD'}
        />
      </div>
      <div className="instruction-address">
        <label htmlFor="address-input">Dirección:</label>
        <input 
          type="text" 
          id="address-input" 
          value={address.join(',')} 
          onChange={(e) => setAddress(e.target.value.split(','))} 
          placeholder="Separados por coma"
        />
      </div>
      <div className="write-policy">
        <h4>Política de Escritura</h4>
        <label htmlFor="write-policy-select">Política:</label>
        <select id="write-policy-select" value={writePolicy} onChange={handleWritePolicyChange}>
          <option value="BACK">Write Back</option>
          <option value="THROUGH">Write Through</option>
        </select>
      </div>
      <button type="button" onClick={handleLoadData}>Load Data</button>
      <div className="instruction-buttons">
        <button type="button" onClick={nextButtonClick}>Next</button>
        <button type="button" onClick={fastForwardButtonClick}>Fast-Forward</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </div>
      <div className="log-area">
        <h4>Log</h4>
        <textarea value={log} readOnly rows="10" cols="50"></textarea>
      </div>
    </form>
  );
};

export default CacheConfigForm;

