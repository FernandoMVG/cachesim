import {fully_associative_mapping, fully_associative_modify} from "./Fully.js";

export let target_set;
let n_sets;
let fifo_array = [];
let lru_array = [];

export function set_bin_segmentation(address, s_cc, s_blq, s_mp, n_sets) {
    const bits_dir = Math.log2(s_mp);
    const bits_off = Math.log2(s_blq);
    let bits_ind = Math.ceil(Math.log2(n_sets));
    bits_ind = Math.max(bits_ind, 1);
    const bits_tag = bits_dir - (bits_off + bits_ind);
    const bin_add = address.toString(2).padStart(bits_dir, '0');
    const tag = bin_add.slice(0, bits_tag);
    const index = bin_add.slice(bits_tag, -bits_off);
    const offset = bin_add.slice(-bits_off);
    
    console.log("Tag", tag)
    console.log("Index", index)
    console.log("Offset", offset)
    return [tag, index, offset];
  }
  

  export function load_set(cache_arr, address, replacement_policy, write_policy = "BACK", s_cc, s_blq, s_mp, main_memory, fifo_array, lru_array, n_sets) {
    let newCache = [...cache_arr];
    let newMainMemory = [...main_memory];

    if (address >= s_mp) {
      return "Address should be smaller than Main memory";
    }
  
    const [tag, target_index, offset] = set_bin_segmentation(address, s_cc, s_blq, s_mp, n_sets);
    let index = target_index;
    console.log("Target index", target_index)
    let target_set = parseInt(target_index, 2);
    console.log(`Accessing set: ${target_set}\n`);
    const cache_set = newCache[target_set];
    console.table(cache_set);
    //console.log(fifo_array[target_set])
    const [curr_line, cache_entry, w_mem, hit, logMessages] = fully_associative_mapping(cache_set, address, tag, offset, replacement_policy, fifo_array[target_set], lru_array[target_set], write_policy, s_cc, s_blq, s_mp, main_memory);
    newCache[target_set] = cache_set; // Ensure the modified set is saved back
    console.log("Result hit de load set", hit)
    return { cache: newCache, mainMemory: newMainMemory, tag, index, offset, hit};
  }
  
  export function store_set(cache_arr, address, data, replacement_policy, write_policy = "BACK", s_cc, s_blq, s_mp, main_memory, fifo_array, lru_array, n_sets) {
    let newCache = [...cache_arr];
    let newMainMemory = [...main_memory];

    if (address >= s_mp) {
      return "Address should be smaller than Main memory";
    }
  
    const [tag, target_index, offset] = set_bin_segmentation(address, s_cc, s_blq, s_mp, n_sets);
    let index = target_index;
    target_set = parseInt(target_index, 2);
    console.log(`Accessing set: ${target_set}`);
    console.log("target index", target_index)
    const [curr_line, cache_entry, w_mem, hit, logMessages] = fully_associative_modify(newCache[target_set], address, data, tag, offset, replacement_policy, fifo_array[target_set], lru_array[target_set], write_policy, s_cc, s_blq, s_mp, newMainMemory, "SET");
    console.log("Result hit de store set", hit)
    
    return { cache: newCache, mainMemory: newMainMemory, hit, tag, index, offset };
  }