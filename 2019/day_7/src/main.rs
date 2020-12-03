use std::fs;
use std::collections::VecDeque;
use std::collections::HashMap;
use std::iter::FromIterator;
use std::cmp;
use itertools::Itertools;

fn main(){
    let mut _numbers : Vec<i32> = 
        fs::read_to_string("input.txt")
        .unwrap()
        .trim()
        .split(',')
        .map(|s| s.parse::<i32>().unwrap())
        .collect();
    let part_one = max_amplifier_combination(&mut _numbers.to_vec(), 0, 5);
    println!("Part one answer is: {}", part_one);

    let part_two = max_feedback_loop(&mut _numbers.to_vec(), 5, 10);
    println!("Part two answer is: {}", part_two);
}

fn max_amplifier_combination(numbers : &mut Vec<i32>, amp_start : i32, amp_end : i32) -> i32{
    let mut max = 0;
    for comb in (amp_start..amp_end).permutations((amp_end-amp_start) as usize){
        max = cmp::max(max, apply_amplifier(numbers, &mut VecDeque::from_iter(comb)));
    }
    max
}


fn apply_amplifier(numbers : &mut Vec<i32>, sequence: &mut VecDeque<i32>) -> i32 {
    let mut acc_output = 0;
    while !sequence.is_empty(){
        let mut inputs = VecDeque::new();
        inputs.push_back(sequence.pop_front().unwrap());
        inputs.push_back(acc_output);
        acc_output = intcode(numbers, &mut inputs, 0).0;
    }
    acc_output
}

fn intcode(numbers : &mut Vec<i32>, amplifier : &mut VecDeque<i32>, mut index: usize) -> (i32, usize, Vec<i32>, bool) {
    let mut output = 0;

    while index < numbers.len(){
        let instruction_code = numbers[index];
        let opcode = instruction_code % 100;
        match opcode{
            1 | 2 => {
                let insert_index = numbers[index+3] as usize;
                let params = get_params(&numbers, 2, index);
                if opcode == 1 {
                    numbers[insert_index] = params[0] + params[1];
                }
                else{
                    numbers[insert_index] = params[0] * params[1];
                }
                index+=4;
            },
            3 => {
                let input = amplifier.pop_front().unwrap();
                let insert_index = numbers[index+1] as usize;
                numbers[insert_index] = input;
                index+=2;
            },
            4 => {
                let params = get_params(&numbers, 1, index);
                output = params[0];
                index+=2;
                if amplifier.is_empty(){
                    break;
                }
            },
            5 | 6 => {
                let params = get_params(&numbers, 2, index);
                if (opcode == 5 && params[0] == 0) || (opcode == 6 && params[0] != 0) {
                    index+=3;
                    continue;
                }
                index = params[1] as usize;
            },
            7 | 8 => {
                let params = get_params(&numbers, 2, index);
                let insert_index = numbers[index+3] as usize;
                if (opcode == 7 && params[0] < params[1]) || (opcode == 8 && params[0] == params[1]) {
                    numbers[insert_index] = 1;
                }else{
                    numbers[insert_index] = 0;
                }
                index+=4;
            },
            99 => {
                return (output, index, numbers.to_vec(), true);
            }
            _ => break,
        }
    }
    (output, index, numbers.to_vec(), false)
}

fn get_params(numbers: &Vec<i32>, num_params: usize, ins_ptr: usize) -> Vec<i32> {
    let mut params = Vec::new();
    for i in 1..num_params+1{
        let param_mode = numbers[ins_ptr] / 10_i32.pow(i as u32+1) % 2;
        params.push(handle_parameter_mode(&numbers, param_mode, numbers[ins_ptr+i]));
    }
    params
}

fn handle_parameter_mode(numbers : &Vec<i32>, param_mode : i32, value: i32) -> i32{
    match param_mode{
        0 => return numbers[value as usize],
        1 => return value,
        _ => panic!("Unexpected param mode parsed : {}", param_mode)
    }
}

fn max_feedback_loop(numbers : &mut Vec<i32>, amp_start : i32, amp_end : i32) -> i32{
    let mut max = 0;
    for comb in (amp_start..amp_end).permutations((amp_end-amp_start) as usize){
        max = cmp::max(max, apply_feedback_loop(numbers, &mut VecDeque::from_iter(comb)));
    }
    max
}

fn apply_feedback_loop(numbers : &mut Vec<i32>, sequence: &mut VecDeque<i32>) -> i32{
    let mut output_map = HashMap::new();
    let mut acc_output = 0;
    for i in 0..sequence.len(){
        let mut inputs = VecDeque::new();
        inputs.push_back(sequence[i]);
        inputs.push_back(acc_output);
        let local_output = intcode(&mut numbers.to_vec(), &mut inputs, 0);
        output_map.insert(i,local_output.clone());
        acc_output = local_output.0;
    }
    loop {
        for i in 0..sequence.len(){
            let mut inputs = VecDeque::new();
            inputs.push_back(acc_output);
            let local_output = intcode(&mut output_map[&i].2.clone(), &mut inputs, output_map[&i].1);
            if local_output.3 {
                return acc_output
            }
            output_map.insert(i,local_output.clone());
            acc_output = local_output.0;
        }
    }
}
