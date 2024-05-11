export function modify(index, tag, address, matrix, s_blq, main_memory) {
    const valid_bit = 1;
    const dirty_bit = 0;
    const start_address = Math.floor(address / s_blq);
    const data_block = main_memory.slice(start_address, start_address + s_blq);
    // Update cache values
    matrix[index].splice(1, 4, valid_bit, tag, dirty_bit, data_block);
    return data_block;
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

  export function load_direct(cache, address, write_policy = "BACK", s_cc, s_blq, s_mp, main_memory) {
    if (address >= s_mp) {
      return "Address should be smaller than Main memory";
    }
    console.log(cache);
    let [bin_add, tag, target_index, offset] = direct_bin_segmentation(address, s_cc, s_blq, s_mp);
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
        write_mem(main_memory,line,s_cc,s_blq,s_mp);
        w_mem = true;
      }
  
      modify(target_index, tag, address, cache,s_blq, main_memory);
      cache_entry = line[4][parseInt(offset, 2)];
    }
  
    return cache;
  }
  
  export function mostrar (cache) {
    console.log(cache);
  }

  