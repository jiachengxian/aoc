use std::fs;
use std::collections::HashMap;

mod intcode;

fn main() {
    let input = fs::read_to_string("input.txt").expect("Failed to read file");
    let mut numbers : Vec<i64> = 
        input.trim()
            .split(',')
            .map(|s| s.parse::<i64>().unwrap())
            .collect();
    let camera_output = parse_camera_output(&mut numbers);
    //render(camera_output);
    println!("{}",calc_intersection_alignment(camera_output));
}

fn parse_camera_output(data : &mut Vec<i64>) -> HashMap<(usize, usize), char> {
    let mut intcode = intcode::IntCode::new(data.to_vec(), 0, 0, 0);
    let mut halt = false;
    let mut camera_output = HashMap::new();
    let mut x = 0;
    let mut y = 0;

    while !halt{
        let result = intcode.run();
        halt = result.4;
        let output = result.0;
        if output == 10 {
            y += 1;
            x = 0;
        }
        camera_output.insert((x,y), output as u8 as char);
        x += 1;
    }
    camera_output
}

fn render(map : HashMap<(usize, usize), char>) {
    for y in 0..50{
        let mut line = String::new();
        for x in 0..50{
            line.push(' ');
            if !map.contains_key(&(x,y)){
                line.push(' ');
            }else{
                line.push(map[&(x,y)])
            }
        }
        println!("{}",line);
    }
}

fn calc_intersection_alignment(map : HashMap<(usize, usize), char>) -> usize {
    let mut sum = 0;
    let filtered_map = map.keys().filter(|x| map[x] == '#');
    for y in 1..49{
        for x in 1..49{
            if map.contains_key(&(x,y)) && map[&(x,y)] == '#' &&
                map[&(x+1,y)] == '#' &&
                map[&(x-1,y)] == '#' &&
                map[&(x,y+1)] == '#' &&
                map[&(x,y-1)] == '#'
            {
                sum+=1;
            }
        }
    }
    sum
}
