use std::io::Error;
use std::fs;
use std::collections::HashMap;

mod intcode;

fn main() -> Result<(), Error> {
    let input = fs::read_to_string("input.txt").expect("Failed to read file");
    let mut _numbers : Vec<i64> = 
        input.trim()
            .split(',')
            .map(|s| s.parse::<i64>().unwrap())
            .collect();

    _numbers[0] = 2;
    let mut intcode = intcode::IntCode::new(_numbers.to_vec(), 0, 0, 0);
    let mut halt = false;
    let mut pos = HashMap::new();
    let mut score = 0;
    let mut ball_pos = 0;
    let mut paddle_pos = 0;
    while !halt{
        let x = intcode.run().0;
        let y = intcode.run().0;
        let result = intcode.run();
        let c = result.0;
        if c == 4 {
            ball_pos = x;
        }
        if c == 3 {
            paddle_pos = x;
        }
        if ball_pos < paddle_pos {
            intcode.set_input(-1);
        }
        else if ball_pos > paddle_pos {
            intcode.set_input(1);
        }
        else{
            intcode.set_input(0);
        }
        halt = result.4;
        if x == -1 && y == 0{
            score = c;
        }else{
            pos.insert((x,y),c);
        }
        
    }
    println!("Number of blocks left: {}",pos.values().filter(|&x| *x==2).count());
    println!("{}",score);
    Ok(())
}
