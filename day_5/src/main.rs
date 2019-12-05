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
        let param_mode = instruction_code / 100;

        match opcode{
            1 | 2 => {
                let insert_index = numbers[index+3] as usize;
                let param_one = handle_parameter_mode(&numbers, param_mode, numbers[index+1], 0);
                let param_two = handle_parameter_mode(&numbers, param_mode, numbers[index+2], 1);
                if opcode == 1 {
                    numbers[insert_index] = param_one + param_two;
                }
                else{
                    numbers[insert_index] = param_one * param_two
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
                let param_one = handle_parameter_mode(&numbers, param_mode, numbers[index+1], 0);
                println!("Opcode 4 printout: {}",param_one);
                index+=2;
            },
            5 | 6 => {
                let param_one = handle_parameter_mode(&numbers, param_mode, numbers[index+1], 0);
                let param_two = handle_parameter_mode(&numbers, param_mode, numbers[index+2], 1);
                if (opcode == 5 && param_one == 0) || (opcode == 6 && param_one != 0) {
                    index+=3;
                    continue;
                }
                println!("Jumping to instruction pointer: {}", param_two);
                index = param_two as usize;
            },
            7 | 8 => {
                let param_one = handle_parameter_mode(&numbers, param_mode, numbers[index+1], 0);
                let param_two = handle_parameter_mode(&numbers, param_mode, numbers[index+2], 1);
                let insert_index = numbers[index+3] as usize;
                if (opcode == 7 && param_one < param_two) || (opcode == 8 && param_one == param_two) {
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

fn handle_parameter_mode(numbers : &Vec<i32>, param_mode : i32, value: i32, param_num: i32) -> i32{
    if param_mode / 10_i32.pow(param_num as u32) == 0{
        return numbers[value as usize];
    }
    let param_mode_string : &str = &param_mode.to_string().chars().rev().collect::<String>();
    match &param_mode_string[(param_num as usize)..(param_num as usize + 1)]{
        "0" => return numbers[value as usize],
        "1" => return value,
        _ => panic!("Unexpected param mode parsed : {}", param_mode)
    }
}
