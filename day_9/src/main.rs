use std::io::{BufReader, BufRead, Error};
use std::fs::File;
use std::io;

fn main() -> Result<(), Error> {
    let file = File::open("input.txt").expect("Failed to open file.");
    let reader = BufReader::new(file);
    
    for line in reader.lines(){
        let mut _numbers : Vec<i64> = 
            line.unwrap()
                .split(',')
                .map(|s| s.parse::<i64>().unwrap())
                .collect();
        intcode(&mut _numbers.to_vec(), 0, 0);
    }
    Ok(())
}

fn intcode(numbers : &mut Vec<i64>, mut index: usize, mut relative_base: i64) {

    while index < numbers.len(){
        let instruction_code = numbers[index];
        let opcode = instruction_code % 100;
        match opcode{
            1 | 2 => {
                let insert_index = get_insert_index(numbers, 3, index, relative_base);
                let params = get_params(numbers, 2, index, relative_base);
                if opcode == 1 {
                    set_instruction(numbers, insert_index, params[0] + params[1]);
                }
                else{
                    set_instruction(numbers, insert_index, params[0] * params[1]);
                }
                index+=4;
            },
            3 => {
                let mut input = String::new();
                println!("Please input a number for opcode 3: ");
                io::stdin().read_line(&mut input)
                    .expect("Failed to read line");
                let input : i64 = input.trim().parse::<i64>().unwrap();
                let insert_index = get_insert_index(numbers, 1, index, relative_base);
                set_instruction(numbers, insert_index, input);
                index+=2;
            },
            4 => {
                let params = get_params(numbers, 1, index, relative_base);
                println!("Opcode 4 printout: {}",params[0]);
                index+=2;
            },
            5 | 6 => {
                let params = get_params(numbers, 2, index, relative_base);
                if (opcode == 5 && params[0] == 0) || (opcode == 6 && params[0] != 0) {
                    index+=3;
                    continue;
                }
                println!("Jumping to instruction pointer: {}", params[1]);
                index = params[1] as usize;
            },
            7 | 8 => {
                let params = get_params(numbers, 2, index, relative_base);
                let insert_index = get_insert_index(numbers, 3, index, relative_base);
                if (opcode == 7 && params[0] < params[1]) || (opcode == 8 && params[0] == params[1]) {
                    set_instruction(numbers, insert_index, 1);
                }else{
                    set_instruction( numbers, insert_index, 0);
                }
                index+=4;
            },
            9 => {
                let params = get_params(numbers, 1, index, relative_base);
                relative_base += params[0];
                index+=2;
            },
            _ => break,
        }
    }
}

fn get_params(numbers: &mut Vec<i64>, num_params: usize, ins_ptr: usize, relative_base: i64) -> Vec<i64> {
    let mut params = Vec::new();
    for i in 1..num_params+1{
        let param_mode = numbers[ins_ptr] / 10_i64.pow(i as u32+1) % 10;
        let value = get_instruction(numbers, ins_ptr+i);
        params.push(handle_parameter_mode(numbers, param_mode, value, relative_base));
    }
    params
}

fn get_insert_index(numbers: &mut Vec<i64>, param_index: usize, ins_ptr: usize, relative_base: i64) -> usize {
    let param_mode = numbers[ins_ptr] / 10_i64.pow(param_index as u32+1) % 10;
    match param_mode{
        0 => return get_instruction(numbers, ins_ptr + param_index) as usize,
        2 => return (get_instruction(numbers, ins_ptr + param_index) + relative_base) as usize,
        _ => panic!("Unexpected insert index param mode parsed : {}", param_mode)
    }
}

fn handle_parameter_mode(numbers : &mut Vec<i64>, param_mode : i64, value: i64, relative_base: i64) -> i64{
    match param_mode{
        0 => return get_instruction(numbers, value as usize),
        1 => return value,
        2 => return get_instruction(numbers, (value + relative_base) as usize),
        _ => panic!("Unexpected param mode parsed : {}", param_mode)
    }
}

fn handle_overflow(numbers : &mut Vec<i64>, index : usize) {
    if index < numbers.len() {
        return;
    }
    numbers.extend(vec![0;index-numbers.len()+1]);
}

fn get_instruction(numbers : &mut Vec<i64>, index : usize) -> i64 {
    handle_overflow(numbers, index);
    numbers[index]
}

fn set_instruction(numbers : &mut Vec<i64>, index : usize, value : i64) {
    handle_overflow(numbers, index);
    numbers[index] = value;
}
