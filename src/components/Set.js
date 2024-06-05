import {fully_associative_mapping, fully_associative_modify} from "./Fully.js";

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