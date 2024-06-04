//Direct.Js

import { write_mem } from './CacheOperations';

export function load_direct(cache, address, write_policy = "BACK", s_cc, s_blq, s_mp, main_memory) {
  let newCache1 = [...cache];
  let newMainMemory = [...main_memory]; // Crea una copia de main_memory

  if (address >= s_mp) {
    return { cache: newCache1, mainMemory: newMainMemory, message: "Address should be smaller than Main memory" };
  }
  
  let [_, tag, target_index, offset] = direct_bin_segmentation(address, s_cc, s_blq, s_mp);
  target_index = parseInt(target_index, 2) + 1;
  let line = newCache1[target_index];

  const [valid_bit, cached_tag, dirty_bit] = line.slice(1, 4);
  let cache_entry;
  let message;

  // CACHE HIT
  if (valid_bit === 1 && cached_tag === tag) {
    cache_entry = line[4][parseInt(offset, 2)];
    message = `Cache hit! Address ${address} at index: ${target_index - 1} found ${cache_entry}`;
    console.log(message);
  } else {
    // CACHE MISS
    message = `Cache miss. Address ${address} Saving data to index ${target_index - 1}.`;
    console.log(message);
    if (write_policy === "BACK" && dirty_bit === 1) {
      write_mem(newMainMemory, line, "DIRECT", s_cc, s_blq, s_mp);
      
    }

    modify(target_index, tag, address, newCache1, s_blq, newMainMemory);
    cache_entry = newCache1[target_index][4][parseInt(offset, 2)];
  }

  return { cache: newCache1, mainMemory: newMainMemory, message };
}

// Direct.js

export function store_direct(cache, address, data, write_policy, s_cc, s_blq, s_mp, main_memory) {
  let newCache = [...cache];
  let newMainMemory = [...main_memory]; // Crea una copia de main_memory

  if (address >= s_mp) {
      return { cache: newCache, mainMemory: newMainMemory, message: "Address should be smaller than Main memory" };
  }

  let [_, tag, target_index, offset] = direct_bin_segmentation(address, s_cc, s_blq, s_mp);
  target_index = parseInt(target_index, 2) + 1;
  const line = newCache[target_index];
  const [valid_bit, cached_tag, dirty_bit] = line.slice(1, 4);
  let cache_entry;
  let message;

  if (valid_bit === 1 && cached_tag === tag) {
      message = `Cache hit! Address ${address} at index ${target_index - 1} modified to ${data}`;
      console.log(message);
      line[4][parseInt(offset, 2)] = data;
      line[3] = 1; // Dirty bit set
      cache_entry = line[4][parseInt(offset, 2)];
  } else {
      message = `Cache miss. Address ${address} Saving data to index ${target_index - 1} with modified value ${data}`;
      console.log(message);
      if (write_policy === "BACK" && dirty_bit === 1) {
          write_mem(newMainMemory, line, "DIRECT", s_cc, s_blq, s_mp);
      }
      modify(target_index, tag, address, newCache, s_blq, newMainMemory);
      newCache[target_index][4][parseInt(offset, 2)] = data;
      newCache[target_index][3] = 1; // Dirty bit set
      cache_entry = newCache[target_index][4][parseInt(offset, 2)];
  }

  if (write_policy === "THROUGH") {
      write_mem(newMainMemory, newCache[target_index], "DIRECT", s_cc, s_blq, s_mp);
  }

  return { cache: newCache, mainMemory: newMainMemory, message };
}


export function direct_bin_segmentation(address, s_cc, s_blq, s_mp) {
  const bits_dir = Math.log2(s_mp);
  const bits_off = Math.log2(s_blq);
  const bits_ind = Math.ceil(Math.log2(s_cc / s_blq));
  const bits_tag = bits_dir - (bits_off + bits_ind);

  const bin_add = address.toString(2).padStart(bits_dir, '0');
  const tag = bin_add.slice(0, bits_tag);
  const index = bin_add.slice(bits_tag, -bits_off);
  const offset = bin_add.slice(-bits_off);
  return [bin_add, tag, index, offset];
}

export function modify(index, tag, address, matrix, s_blq, main_memory) {
  const valid_bit = 1;
  const dirty_bit = 0;
  const start_address = Math.floor(address / s_blq);
  const data_block = main_memory.slice(start_address, start_address + s_blq);
  // Update cache values
  matrix[index].splice(1, 4, valid_bit, tag, dirty_bit, data_block);
  console.log('Data block:', data_block)
  return data_block;
}