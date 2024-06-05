// fully.js
import { write_mem } from './CacheOperations';

let fifo_q = [];
let lru_q = [];
let main_memory = [];

export function fully_bin_segmentation(address, s_mp, s_blq) {
  const bits_dir = Math.log2(s_mp);
  const bits_off = Math.log2(s_blq);
  const bits_tag = bits_dir - bits_off;

  const bin_add = address.toString(2).padStart(bits_dir, '0');
  const tag = bin_add.slice(0, bits_tag);
  const offset = bin_add.slice(-bits_off);

  return [bin_add, tag, offset];
}

export function fully_associative_mapping(cache, address, tag, offset, replacement_policy, repl_queue, use_queue, write_policy, s_cc, s_blq, s_mp, main_memory) {
  let w_mem = false;
  let hit = false;
  let empty_index = null;
  let cache_entry;
  let curr_line;
  const N_lines = Math.ceil(s_cc / s_blq);
  let logMessages = [];

  for (let i = 1; i <= N_lines; i++) {
    let line = cache[i];
    const [index, valid_bit, cached_tag] = line.slice(0, 3);

    // CACHE HIT
    if (valid_bit === 1 && cached_tag === tag) {
      use_queue.splice(use_queue.indexOf(i), 1);
      use_queue.push(i);
      const message = `Cache hit! Address ${address} at index ${i - 1} found ${cache_entry}`;
      console.log(message);
      logMessages.push(message);
      curr_line = cache[i];
      cache_entry = line[4][parseInt(offset, 2)];
      hit = true;
    } else if (empty_index === null && valid_bit === 0) {
      empty_index = i;
    }
  }

  if (!hit) {
    // INSERTION CASE
    if (empty_index !== null) {
      const message = `Cache miss. Saving data to index ${empty_index - 1}.`;
      console.log(message);
      logMessages.push(message);
      repl_queue.push(empty_index);
      use_queue.push(empty_index);
      modify(empty_index, tag, address, cache, s_blq, main_memory);
      curr_line = cache[empty_index];
      cache_entry = curr_line[4][parseInt(offset, 2)];
    } else {
      // REPLACEMENT CASE
      let victim_index;
      if (replacement_policy === "FIFO") {
        victim_index = repl_queue.shift();
        repl_queue.push(victim_index);
      } else if (replacement_policy === "LRU") {
        victim_index = use_queue.shift();
        use_queue.push(victim_index);
      } else if (replacement_policy === "RANDOM") {
        victim_index = Math.floor(Math.random() * N_lines) + 1;
      }

      const message = `Cache miss. Evicting line at index ${victim_index - 1}.`;
      console.log(message);
      logMessages.push(message);

      if (write_policy === "BACK" && cache[victim_index][3] === 1) {
        write_mem(main_memory ,cache[victim_index], "FULLY", s_cc, s_blq, s_mp);
        w_mem = true;
      }

      modify(victim_index, tag, address, cache, s_blq, main_memory);
      curr_line = cache[victim_index];
      cache_entry = curr_line[4][parseInt(offset, 2)];
    }
  }

  return [curr_line, cache_entry, w_mem, hit, logMessages];
}

export function load_fully(cache, address, replacement_policy, write_policy = "BACK", s_cc, s_blq, s_mp, main_memory) {
  let newCache2 = [...cache];
  let newMainMemory = [...main_memory]; // Crea una copia de main_memory

  if (address >= s_mp) {
    return { cache: newCache2, mainMemory: newMainMemory, message: "Address should be smaller than Main memory", log: [] };
  }

  let [bin_add, tag, offset] = fully_bin_segmentation(address, s_mp, s_blq);
  let [curr_line, cache_entry, w_mem, hit, logMessages] = fully_associative_mapping(newCache2, address, tag, offset, replacement_policy, fifo_q, lru_q, write_policy, s_cc, s_blq, s_mp, newMainMemory);

  return { cache: newCache2, mainMemory: newMainMemory, message: hit ? `Cache hit! Address ${address} found ${cache_entry}` : `Cache miss. Address ${address} loaded`, log: logMessages, hit: hit, tag, offset };
}

export function fully_associative_modify(cache, address, data, tag, offset, replacement_policy, repl_queue, use_queue, write_policy, s_cc, s_blq, s_mp, main_memory) {
  let w_mem = false;
  let hit = false;
  let empty_index = null;
  let curr_line;
  let cache_entry;
  const N_lines = Math.ceil(s_cc / s_blq);
  let logMessages = [];

  for (let i = 1; i <= N_lines; i++) {
    let line = cache[i];
    const [index, valid_bit, cached_tag] = line.slice(0, 3);

    // CACHE HIT
    if (valid_bit === 1 && cached_tag === tag) {
      use_queue.splice(use_queue.indexOf(i), 1);
      use_queue.push(i);
      const message = `Cache hit! Address ${address} at index ${i - 1} modified to ${data}`;
      console.log(message);
      logMessages.push(message);
      curr_line = cache[i];
      curr_line[4][parseInt(offset, 2)] = data;
      curr_line[3] = 1;
      cache_entry = line[4][parseInt(offset, 2)];
      hit = true;
    } else if (empty_index === null && valid_bit === 0) {
      empty_index = i;
    }
  }

  if (!hit) {
    // INSERTION CASE
    if (empty_index !== null) {
      const message = `Cache miss. Address ${address} Saving data to index ${empty_index - 1} with modified value ${data}`;
      console.log(message);
      logMessages.push(message);
      repl_queue.push(empty_index);
      use_queue.push(empty_index);
      modify(empty_index, tag, address, cache, s_blq, main_memory);

      curr_line = cache[empty_index];
      curr_line[4][parseInt(offset, 2)] = data;
      curr_line[3] = 1;
      cache_entry = cache[empty_index][4][parseInt(offset, 2)];
    } else {
      // REPLACEMENT CASE
      let victim_index;
      if (replacement_policy === "FIFO") {
        victim_index = repl_queue.shift();
        repl_queue.push(victim_index);
      } else if (replacement_policy === "LRU") {
        victim_index = use_queue.shift();
        use_queue.push(victim_index);
      } else if (replacement_policy === "RANDOM") {
        victim_index = Math.floor(Math.random() * N_lines) + 1;
      }

      const message = `Cache miss.  Address ${address} Evicting line at index ${victim_index - 1}.  Saving data with modified value ${data}`;
      console.log(message);
      logMessages.push(message);

      // WRITES BACK IF NECESSARY DIRTY BIT == 1, BEFORE REPLACEMENT
      if (write_policy === "BACK" && cache[victim_index][3] === 1) {
        write_mem(main_memory, cache[victim_index], "FULLY", s_cc, s_blq, s_mp);
        w_mem = true;
      }

      // IF THE STORE MISSED, WE LOAD THE DATA AND THEN MODIFY IT
      modify(victim_index, tag, address, cache, s_blq, main_memory);

      curr_line = cache[victim_index];
      curr_line[4][parseInt(offset, 2)] = data;
      curr_line[3] = 1;
      cache_entry = cache[victim_index][4][parseInt(offset, 2)];
    }
  }

  if (write_policy === "THROUGH") {
    write_mem(main_memory, curr_line, "FULLY", s_cc, s_blq, s_mp);
    w_mem = true;
  }

  return [curr_line, cache_entry, w_mem, hit, logMessages];
}

export function store_fully(cache, address, data, replacement_policy, write_policy = "BACK", s_cc, s_blq, s_mp, main_memory) {
  let newCache = [...cache];
  let newMainMemory1 = [...main_memory]; // Crea una copia de main_memory

  if (address >= s_mp) {
    return { cache: newCache, mainMemory: newMainMemory1, message: "Address should be smaller than Main memory", log: [] };
  }

  const [bin_add, tag, offset] = fully_bin_segmentation(address, s_mp, s_blq);
  const [curr_line, cache_entry, w_mem, hit, logMessages] = fully_associative_modify(newCache, address, data, tag, offset, replacement_policy, fifo_q, lru_q, write_policy, s_cc, s_blq, s_mp, newMainMemory1);

  return { cache: newCache, mainMemory: newMainMemory1, message: hit ? `Cache hit! Address ${address} modified to ${data}` : `Cache miss. Address ${address} stored`, log: logMessages, hit: hit, tag, offset };
}

function modify(index, tag, address, matrix, s_blq, main_memory) {
  const valid_bit = 1;
  const dirty_bit = 0;
  const start_address = Math.floor(address / s_blq) * s_blq;
  const data_block = main_memory.slice(start_address, start_address + s_blq);
  // Actualiza los valores de la caché
  console.log("Casto cheche cache");
  matrix[index] = [index - 1, valid_bit, tag, dirty_bit, data_block];
  return data_block;
}


