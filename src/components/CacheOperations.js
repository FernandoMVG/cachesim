// CacheOperations.js

export const initCache = (cacheSize, blockSize) => {
  if (blockSize >= cacheSize) {
    alert("Block size must be smaller than cache size, cache not initialized");
    return [];
  }

  return createCache(Math.ceil(cacheSize / blockSize));
}

export const createCache = (lines) => {
  const columnTitles = ['INDEX', 'VALID', 'TAG', 'DATA', 'DIRTY BIT'];
  const matrix = []; // Initialize with titles

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

  // If it's already an exact power, return it
  if (power === n) {
      return power;
  }
  // If it's not, truncate to the next power
  return power * 2;
}
  