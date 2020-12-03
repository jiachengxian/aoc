use std::io::{BufReader, BufRead, Error};
use std::fs::File;

fn main() -> Result<(), Error> {
    let file = File::open("input.txt").expect("Failed to open file.");
    let reader = BufReader::new(file);
    
    for line in reader.lines(){
        let mut _numbers : Vec<usize> = 
            line.unwrap()
                .split(',')
                .map(|s| s.parse::<usize>().unwrap())
                .collect();
        println!("Part 1 Answer : {}", intcode(12, 2, &mut _numbers.to_vec()));
        println!("Part 2 Answer : {}", brute_force(&mut _numbers.to_vec(), 19690720));
    }
    Ok(())
}

fn intcode(noun : usize, verb : usize, numbers : &mut Vec<usize>) -> usize {
    numbers[1] = noun;
    numbers[2] = verb;
    for index in 0..numbers.len(){
        if index % 4 != 0 {
            continue;
        }
        //necessary to avoid borrowing 'numbers' as immutable and mutable in same line
        let insert_index = numbers[index+3];
        //match opcode with each case
        match numbers[index] {
            1 => numbers[insert_index] = numbers[numbers[index+1]] + numbers[numbers[index+2]],
            2 => numbers[insert_index] = numbers[numbers[index+1]] * numbers[numbers[index+2]],
            _ => break,
        }
    }
    numbers[0]
}

fn brute_force(numbers : &mut Vec<usize>, output : usize) -> usize {
    for noun in 0..numbers.len() {
        for verb in 0..numbers.len(){
            if intcode(noun, verb, &mut numbers.to_vec()) == output {
                return noun*100 + verb;
            }
        }
    }
    panic!("Failed to find solution!")
}
