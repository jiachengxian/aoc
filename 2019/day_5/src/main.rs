use std::io::{BufReader, BufRead, Error};
use std::fs::File;
use std::io;

fn main() -> Result<(), Error> {
    let file = File::open("input.txt").expect("Failed to open file.");
    let reader = BufReader::new(file);
    
    for line in reader.lines(){
        let mut _numbers : Vec<i32> = 
            line.unwrap()
                .split(',')
                .map(|s| s.parse::<i32>().unwrap())
                .collect();
        intcode(&mut _numbers.to_vec());
    }
    Ok(())
}

fn intcode(numbers : &mut Vec<i32>) {
    let mut index = 0;

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
                let mut input = String::new();
                println!("Please input a number for opcode 3: ");
                io::stdin().read_line(&mut input)
                    .expect("Failed to read line");
                let input : i32 = input.trim().parse::<i32>().unwrap();
                let insert_index = numbers[index+1] as usize;
                numbers[insert_index] = input;
                index+=2;
            },
            4 => {
                let params = get_params(&numbers, 1, index);
                println!("Opcode 4 printout: {}",params[0]);
                index+=2;
            },
            5 | 6 => {
                let params = get_params(&numbers, 2, index);
                if (opcode == 5 && params[0] == 0) || (opcode == 6 && params[0] != 0) {
                    index+=3;
                    continue;
                }
                println!("Jumping to instruction pointer: {}", params[1]);
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
            _ => break,
        }
    }
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
