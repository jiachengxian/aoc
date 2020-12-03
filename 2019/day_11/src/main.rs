use std::io::{BufReader, BufRead, Error};
use std::fs::File;
use std::collections::HashMap;

fn main() -> Result<(), Error> {
    let file = File::open("input.txt").expect("Failed to open file.");
    let reader = BufReader::new(file);
    
    for line in reader.lines(){
        let mut _numbers : Vec<i64> = 
            line.unwrap()
                .split(',')
                .map(|s| s.parse::<i64>().unwrap())
                .collect();
        emergency_hull_painting_robot(&mut _numbers.to_vec());
    }
    Ok(())
}

fn emergency_hull_painting_robot(numbers: &mut Vec<i64>) {
    let mut robot_pos = (0,0);
    let mut colors = HashMap::new();
    let mut halt = false;
    let mut index = 0;
    let mut relative_base = 0;
    let mut numbers_clone = numbers.to_vec();
    let mut input;
    let mut output;
    let mut dir = "N";
    colors.insert(robot_pos,"#");
    while !halt{
        if !(colors.contains_key(&robot_pos)){
            input = 0;
        }else{
            if colors[&robot_pos] == "."{
                input = 0;
            }else{
                input = 1;
            }
        }
        let result = intcode(&mut numbers_clone, index, relative_base, input);
        output = result.0;
        index = result.1;
        relative_base = result.2;
        numbers_clone = result.3.clone();
        
        if output == 0 {
            colors.insert(robot_pos,".");
        }else{
            colors.insert(robot_pos,"#");
        }
        let result = intcode(&mut numbers_clone, index, relative_base, input);
        output = result.0;
        index = result.1;
        relative_base = result.2;
        numbers_clone = result.3.clone();
        halt = result.4;

        if dir == "N" {
            if output == 0 {
                robot_pos = (robot_pos.0 - 1, robot_pos.1);
                dir = "W";
            } else {
                robot_pos = (robot_pos.0 + 1, robot_pos.1);
                dir = "E";
            }
        }
        else if dir == "S" {
            if output == 0 {
                robot_pos = (robot_pos.0 + 1, robot_pos.1);
                dir = "E";
            } else {
                robot_pos = (robot_pos.0 - 1, robot_pos.1);
                dir = "W";
            }
        }
        else if dir == "E" {
            if output == 0 {
                robot_pos = (robot_pos.0, robot_pos.1 + 1);
                dir = "N";
            } else {
                robot_pos = (robot_pos.0, robot_pos.1 - 1);
                dir = "S";
            }
        }
        else if dir == "W" {
            if output == 0 {
                robot_pos = (robot_pos.0, robot_pos.1 - 1);
                dir = "S";
            } else {
                robot_pos = (robot_pos.0, robot_pos.1 + 1);
                dir = "N";
            }
        }
    }
    let num_paint = colors.keys().count();
    println!("Part one answer is: {}", num_paint);

    for y in (-6..3).rev(){
        let mut line = String::new();
        for x in 0..50{
            if !colors.contains_key(&(x,y)){
                line.push(' ');
            }else if colors[&(x,y)] == "#" {
                line.push('#');
            }else{
                line.push(' ');
            }
        }
        println!("{}",line);
    }
}

fn intcode(numbers : &mut Vec<i64>, mut index: usize, mut relative_base: i64, input: i64) -> (i64, usize, i64, Vec<i64>, bool) {
    let mut output = 0;
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
                let insert_index = get_insert_index(numbers, 1, index, relative_base);
                set_instruction(numbers, insert_index, input);
                index+=2;
            },
            4 => {
                let params = get_params(numbers, 1, index, relative_base);
                //println!("Opcode 4 printout: {}",params[0]);
                index+=2;
                output = params[0];
                break;
            },
            5 | 6 => {
                let params = get_params(numbers, 2, index, relative_base);
                if (opcode == 5 && params[0] == 0) || (opcode == 6 && params[0] != 0) {
                    index+=3;
                    continue;
                }
                //println!("Jumping to instruction pointer: {}", params[1]);
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
            99 => {
                return (output, index, relative_base, numbers.to_vec(), true);
            },
            _ => break,
        }
    }
    (output, index, relative_base, numbers.to_vec(), false)
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
