// CacheOperations.js

export const initCache = (cacheSize, blockSize) => {
  if (blockSize >= cacheSize) {
    alert("Block size must be smaller than cache size, cache not initialized");
    return [];
  }

  return createCache(Math.ceil(cacheSize / blockSize));
}

export const createCache = (lines) => {
  const columnTitles = ['INDEX', 'VALID', 'TAG', 'DIRTY BIT', 'DATA'];
  const matrix = [];

  for (let i = 0; i < lines + 1; i++) {
    matrix.push(Array(5).fill(0)); 
    matrix[i][0] = i - 1;
  }
  matrix[0] = columnTitles;

  return matrix;
}

export function truncate_to_power_of_2(n) {
  let power = 1;
  while (power * 2 <= n) {
    power *= 2;
  }

  return power;
}

// PASS CACHE BLOCK TO MEMORY
export function write_mem(main_memory,line, type = "DIRECT",s_cc,s_blq,s_mp,target_set=0) {
  const index = line[0];
  const tagDecimal = parseInt(line[2], 2);
  let start_address;

  // RECONSTRUCT ORIGINAL ADDRESS
  if (type === "DIRECT") {
      start_address = (tagDecimal * (s_cc / s_blq) + line[0]) * s_blq;
  } else if (type === "FULLY") {
      start_address = tagDecimal * s_blq;
  } else if (type === "SET") {
      // No encontré una fórmula que aplicara, así que reconstruí la dirección binaria
      const target_set_bin = target_set.toString(2).padStart(Math.log2(s_cc / s_blq), '0');
      const blk = line[2] + target_set_bin;
      const times = Math.log2(s_mp) - blk.length;
      start_address = parseInt(blk + "0".repeat(times), 2);
    }

  for (let i = 0; i < s_blq; i++) {
      main_memory[start_address + i] = line[4][i];
  }
  
}

export function generate_random_string(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset[randomIndex];
  }
  return randomString;
}