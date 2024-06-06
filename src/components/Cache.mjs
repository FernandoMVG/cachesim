import { createInterface } from 'readline';
import randomstring from 'randomstring';
//COSA DE INPUTS DE CONSOLA
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

export function questionAsync(prompt) {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer.trim());
      });
    });
  }

// TODAS LAS VARIABLES GLOABLES QUE USO
let main_memory;
let s_mp;
let s_cc;
let s_blq;
let fifo_q = [];
let lru_q = [];
// SOLO EN CASO DE SET
let target_set;
let n_sets;
let fifo_array = [];
let lru_array = [];
//----------------------------------------------------//

export function is_power_of_2(n) {
    return n > 0 && (n & (n - 1)) === 0;
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

export function generate_random_string(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset[randomIndex];
    }
    return randomString;
}

//LO HICE PA PROBARLO EN CONSOLA SO SUPONGO QUE LO TENDRAS QUE CAMBIAR GOMEN
export function input_check(name) {
    return new Promise((resolve, reject) => {
      rl.question(`Size of ${name} (words): `, (input) => {
        let variable = parseInt(input);
        if (!is_power_of_2(variable)) {
          console.log(`${name} size must be power of 2.`);
          variable = truncate_to_power_of_2(variable);
          console.log(`Truncated size of ${name}: ${variable}`);
        }
        resolve(variable);
      });
    });
  }  


export function create_cache(n) {
    const columnTitles = ['INDEX', 'VALID', 'TAG', 'DIRTY BIT', 'DATA'];
    const matrix = [];

    for (let i = 0; i < n + 1; i++) {
        matrix.push(Array(5).fill(0)); 
        matrix[i][0] = i - 1;
    }

    matrix[0] = columnTitles;
    return matrix;
}

export function init_cache(s_cc, s_blq) {
    if (s_blq >= s_cc) {
        console.log("Block size must be smaller than cache size, cache not initialized");
        return;
    }

    const lines = Math.ceil(s_cc / s_blq);
    const matrix = create_cache(lines); // Assuming createCache export function is defined elsewhere

    return matrix;
}


//----------------------------------------------------//
// PASS MEMORY BLOCK TO CACHE
export function modify(index, tag, address, matrix) {
    const valid_bit = 1;
    const dirty_bit = 0;
    const start_address = Math.floor(address / s_blq)*s_blq;
    const data_block = main_memory.slice(start_address, start_address + s_blq);
    // Update cache values
    matrix[index].splice(1, 4, valid_bit, tag, dirty_bit, data_block);
    return data_block;
}

// PASS CACHE BLOCK TO MEMORY
export function write_mem(line, type = "DIRECT") {
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
    console.log(`Cache line ${index} wrote to memory`);
}


export function around(address, data) {
    main_memory[address] = data;
    console.log(`Data ${data} written at address ${address}, Cache skipped`);
}


//----------------------------------------------------//
export function direct_bin_segmentation(address) {
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
  
export function fully_bin_segmentation(address) {
    const bits_dir = Math.log2(s_mp);
    const bits_off = Math.log2(s_blq);
    const bits_tag = bits_dir - bits_off;
  
    const bin_add = address.toString(2).padStart(bits_dir, '0');
    const tag = bin_add.slice(0, bits_tag);
    const offset = bin_add.slice(-bits_off);
  
    return [bin_add, tag, offset];
  }
  
export function set_bin_segmentation(address) {
    const bits_dir = Math.log2(s_mp);
    const bits_off = Math.log2(s_blq);
    let bits_ind = Math.ceil(Math.log2(s_cc / s_blq / n_sets));
    bits_ind = Math.max(bits_ind, 1);
    const bits_tag = bits_dir - (bits_off + bits_ind);
    const bin_add = address.toString(2).padStart(bits_dir, '0');
    const tag = bin_add.slice(0, bits_tag);
    const index = bin_add.slice(bits_tag, -bits_off);
    const offset = bin_add.slice(-bits_off);
    return [tag, index, offset];
  }
  


//----------------------------------------------------//
  export function load_direct(cache, address, write_policy = "BACK") {
    if (address >= s_mp) {
      return "Address should be smaller than Main memory";
    }
  
    let [bin_add, tag, target_index, offset] = direct_bin_segmentation(address);
    // +1 to account for title row
    target_index = parseInt(target_index, 2) + 1;
    let line = cache[target_index];

    const [valid_bit, cached_tag, dirty_bit] = line.slice(1, 4);
    let w_mem = false;
    let hit = false;
    let cache_entry;

    // CACHE HIT
    if (valid_bit === 1 && cached_tag === tag) {
      cache_entry = line[4][parseInt(offset, 2)];
      console.log(`Cache hit! Address ${address} at index: ${target_index - 1} found ${cache_entry}`);
      hit = true;
    } else {
      // CACHE MISS
      console.log(`Cache miss. Address ${address} Saving data to index ${target_index - 1}.`);
      if (write_policy === "BACK" && dirty_bit === 1) {
        write_mem(line);
        w_mem = true;
      }
  
      modify(target_index, tag, address, cache);
      cache_entry = line[4][parseInt(offset, 2)];
    }
  
    return [line, cache_entry, w_mem, hit];
  }
  
  

  export function store_direct(cache, address, data, write_policy) {
    if (address >= s_mp) {
      return "Address should be smaller than Main memory";
    }
  
    let [bin_add, tag, target_index, offset] = direct_bin_segmentation(address);
    target_index = parseInt(target_index, 2) + 1;
    const line = cache[target_index];
    const [index, valid_bit, cached_tag, dirty_bit] = line.slice(0, 4);
    let w_mem = false;
    let hit = false;
    let cache_entry;

    if (valid_bit === 1 && cached_tag === tag) {
      console.log(`Cache hit! Address ${address} at index: ${target_index - 1} modified to ${data}`);
      line[4][parseInt(offset, 2)] = data;
      line[3] = 1;
      cache_entry = line[4][parseInt(offset, 2)];
      hit = true;
    } else {
      console.log(`Cache miss. Address ${address} Saving data to index ${target_index - 1} with modified value ${data}`);
      if (write_policy === "BACK" && dirty_bit === 1) {
        write_mem(line);
        w_mem = true;
      }
      modify(target_index, tag, address, cache);
      line[4][parseInt(offset, 2)] = data;
      line[3] = 1;
      cache_entry = line[4][parseInt(offset, 2)];
    }
  
    if (write_policy === "THROUGH") {
      write_mem(line);
      w_mem = true;
    }
  
    return [line, cache_entry, w_mem, hit];
  }
  













  

//----------------------------------------------------//
export function fully_associative_mapping(cache, address, tag, offset, replacement_policy, repl_queue, use_queue, write_policy, use = "FULLY") {
    let w_mem = false;
    let hit = false;
    let empty_index = null;
    let cache_entry;
    let curr_line;
    const N_lines = Math.ceil(s_cc / s_blq);
  
    for (let i = 1; i <= N_lines; i++) {
      let line = cache[i];
      const [index, valid_bit, cached_tag] = line.slice(0, 3);
  
      // CACHE HIT
      if (valid_bit === 1 && cached_tag === tag) {
        use_queue.splice(use_queue.indexOf(i), 1);
        use_queue.push(i);
        console.log(`Cache hit! at index: ${i - 1}`);
        curr_line = cache[i];
        cache_entry = curr_line[4][parseInt(offset, 2)];
        hit = true;
      } else if (empty_index === null && valid_bit === 0) {
        empty_index = i;
      }
    }

    if (!hit) {
      // INSERTION CASE
      if (empty_index !== null) {
        console.log(`Cache miss. Saving data to index ${empty_index - 1}.`);
        repl_queue.push(empty_index);
        use_queue.push(empty_index);
        modify(empty_index, tag, address, cache);
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
  
        console.log(`Cache miss. Evicting line at index ${victim_index - 1}.`);
  
        if (write_policy === "BACK" && cache[victim_index][3] === 1) {
          write_mem(cache[victim_index], use);
          w_mem = true;
        }
  
        modify(victim_index, tag, address, cache);
        curr_line = cache[victim_index];
        cache_entry = curr_line[4][parseInt(offset, 2)];
      }
    }
  
    return [curr_line, cache_entry, w_mem, hit];
  }
  
export function load_fully(cache, address, replacement_policy, write_policy = "BACK") {
    if (address >= s_mp) {
        return "Address should be smaller than Main memory";
    }
    const [bin_add, tag, offset] = fully_bin_segmentation(address);
    return fully_associative_mapping(cache, address, tag, offset, replacement_policy, fifo_q, lru_q, write_policy);
}

//----------------------------------------------------//

export function fully_associative_modify(cache, address, data, tag, offset, replacement_policy, repl_queue, use_queue, write_policy, use = "FULLY") {
    let w_mem = false;
    let hit = false;
    let empty_index = null;
    let curr_line;
    let cache_entry;
    const N_lines = Math.ceil(s_cc / s_blq);
  
    for (let i = 1; i <= N_lines; i++) {
      let line = cache[i];
      const [index, valid_bit, cached_tag] = line.slice(0, 3);
  
      // CACHE HIT
      if (valid_bit === 1 && cached_tag === tag) {
        use_queue.splice(use_queue.indexOf(i), 1);
        use_queue.push(i);
        console.log(`Cache hit!  Address ${address} at index: ${i - 1} modified to ${data}`);
  
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
        console.log(`Cache miss. Address ${address} Saving data to index ${empty_index - 1} with modified value ${data}`);
        repl_queue.push(empty_index);
        use_queue.push(empty_index);
        modify(empty_index, tag, address, cache);
  
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
  
        console.log(`Cache miss.  Address ${address} Evicting line at index ${victim_index - 1}.  Saving data with modified value ${data}`);
  
        // WRITES BACK IF NECESSARY DIRTY BIT == 1, BEFORE REPLACEMENT
        if (write_policy === "BACK" && cache[victim_index][3] === 1) {
          write_mem(cache[victim_index], use);
          w_mem = true;
        }
  
        // IF THE STORE MISSED, WE LOAD THE DATA AND THEN MODIFY IT
        modify(victim_index, tag, address, cache);
  
        curr_line = cache[victim_index];
        curr_line[4][parseInt(offset, 2)] = data;
        curr_line[3] = 1;
        cache_entry = cache[victim_index][4][parseInt(offset, 2)];
      }
    }
  
    if (write_policy === "THROUGH") {
      write_mem(curr_line, use);
      w_mem = true;
    }
  
    return [curr_line, cache_entry, w_mem, hit];
  }

  export function store_fully(cache, address, data, replacement_policy, write_policy = "BACK") {
    if (address >= s_mp) {
      return "Address should be smaller than Main memory";
    }
    
    const [bin_add, tag, offset] = fully_bin_segmentation(address);
    return fully_associative_modify(cache, address, data, tag, offset, replacement_policy, fifo_q, lru_q, write_policy);
  }
  






















//----------------------------------------------------//
export function load_set(cache_arr, address, replacement_policy, write_policy = "BACK") {
    if (address >= s_mp) {
      return "Address should be smaller than Main memory";
    }
  
    const [tag, target_index, offset] = set_bin_segmentation(address);
    target_set = parseInt(target_index, 2);
    console.log(`Accessing set: ${target_set}\n`);
    const cache_set = cache_arr[target_set];
    console.table(cache_set);
  
    return fully_associative_mapping(cache_set, address, tag, offset, replacement_policy, fifo_array[target_set], lru_array[target_set], write_policy, "SET");
  }
  
  export function store_set(cache_arr, address, data, replacement_policy, write_policy = "BACK") {
    if (address >= s_mp) {
      return "Address should be smaller than Main memory";
    }
  
    const [tag, target_index, offset] = set_bin_segmentation(address);
    target_set = parseInt(target_index, 2);
    console.log(`Accessing set: ${target_set}`);
  
    return fully_associative_modify(cache_arr[target_set], address, data, tag, offset, replacement_policy, fifo_array[target_set], lru_array[target_set], write_policy, "SET");
  }

//----------------------------------------------------//