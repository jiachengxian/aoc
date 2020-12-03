use std::collections::HashMap;

static RANGE : (i32, i32) = (236491,713787);

fn main() {
    let mut count = 0;
    for number in RANGE.0..RANGE.1{
        let num_string = number.to_string();
        if !is_ordered(&num_string){
            continue;
        }
        if !meets_adjacent_condition(&num_string){
            continue;
        }
        count+=1;
    }
    println!("{}",count);
}

fn is_ordered(input : &str) -> bool {
    let mut in_order : bool = true;
    for i in 1..input.chars().count(){
        in_order = in_order &&
            &input[i..i+1] >= &input[i-1..i];
    }
    in_order
}

fn meets_adjacent_condition(input : &str) -> bool {
    let mut map : HashMap<String,i32> = HashMap::new();
    for i in 0..input.chars().count(){
        let key : String = input[i..i+1].to_string();
        let new_value = 
            if map.contains_key(&key){map.get(&key).unwrap() + 1}
            else { 1 };
        map.insert(key,new_value);
    }
    map.values().any(|&val| val == 2)
}
