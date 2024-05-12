// CacheConfigForm.js
import { useEffect } from 'react';
import React, { useState } from 'react';
import { load_direct, mostrar, generate_random_string } from './Direct.js';
import { initCache, truncate_to_power_of_2 } from './CacheOperations';

const CacheConfigForm = ({ cache, setCache, memory, setMemory }) => { //variables "globales"
  let [cacheSize, setCacheSize] = useState('');
  let [blockSize, setBlockSize] = useState('');
  let [memorySize, setMemorySize] = useState('');
  const [data, setData] = useState([]);
  const [address, setAddress] = useState([]);
  const [isCacheCreated, setIsCacheCreated] = useState(false); // Nuevo estado para rastrear si la caché se ha creado
  let newCache = [];
  let main_memory = [];


  useEffect(() => {
     console.log(cache)
  }, [cache]);

  const handleSubmit = (e) => {
    setCacheSize(truncate_to_power_of_2(cacheSize));
    setBlockSize(truncate_to_power_of_2(blockSize));
    setMemorySize(truncate_to_power_of_2(memorySize));
    e.preventDefault();
    newCache = initCache(cacheSize, blockSize);
    setCache(newCache);
    console.log(newCache);
    setIsCacheCreated(true); // Actualiza el estado para indicar que la caché se ha creado
    // Inicializar memoria principal
    main_memory = Array(memorySize);
    for (let i = 0; i < memorySize; i++) {
      memory[i] = generate_random_string((Math.floor(Math.random() * 8) + 3));
      setMemory(memory);
    }
    console.log(memory);
  };

  const nextButtonClick = (e) => {
    if (!isCacheCreated) {
      alert('Por favor, crea la tabla de caché primero.');
      return;
    }

    const instructionType = document.getElementById('instruction-select').value;
    const dataInput = document.getElementById('data-input').value.split(',');
    const addressInput = document.getElementById('address-input').value.split(',');
    address.map((addr, index) => address[index] = parseInt(addr));
    
    if (dataInput[0] === "" || addressInput[0] === "") {
      alert('Por favor, asegúrate de que los campos de datos y dirección no estén vacíos.');
      return;
    }

    //eliminar el primer elemento de data y address
    let dat = dataInput.shift();
    let add = addressInput.shift();
    setData(dataInput);
    setAddress(addressInput);

    //load_direct(cache, add, 'BACK' ,cacheSize, blockSize, 512, main_memory);
    setCache(load_direct(cache, add, 'BACK' ,cacheSize, blockSize, memorySize, memory));

    
  }

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
        <select id="instruction-select">
          <option value="LOAD">Load</option>
          <option value="STORE">Store</option>
        </select>
      </div>
      <div className="instruction-data">
        <label htmlFor="data-input">Datos:</label>
        <input type="text" id="data-input" value={data.join(',')} onChange={(e) => setData(e.target.value.split(','))} placeholder="Separados por coma"/>  
      </div>
      <div className="instruction-address">
        <label htmlFor="address-input">Dirección:</label>
        <input type="text" id="address-input" value={address.join(',')} onChange={(e) => setAddress(e.target.value.split(',') )} placeholder="Separados por coma"/>
      </div>
      <div className="instruction-buttons">
        <button type="button" onClick={nextButtonClick}>Next</button>
        <button type="button" onClick={nextButtonClick}>fast-Forward</button>
      </div>
    </form>

  );
};

export default CacheConfigForm;
