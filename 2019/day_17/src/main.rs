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
    let mut camera_output = parse_camera_output(&mut numbers);
    println!("Part 1 answer is: {}",calc_intersection_alignment(&mut camera_output));
    //render(&camera_output);
    
    
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
        camera_output.insert((x,y), output as u8 as char);
        x += 1;
        if output == 10 {
            y += 1;
            x = 0;
        }
    }
    camera_output
}

fn calc_intersection_alignment(map : &mut HashMap<(usize, usize), char>) -> usize {
    let filtered : Vec<&(usize,usize)> = map.keys()
        .filter(|x|
            map[&(x.0,x.1)] == '#' && 
            x.0 != 0 && x.1 !=0 &&
            map.contains_key(&(x.0+1,x.1)) && map[&(x.0+1,x.1)] == '#' &&
            map.contains_key(&(x.0-1,x.1)) && map[&(x.0-1,x.1)] == '#' &&
            map.contains_key(&(x.0,x.1+1)) && map[&(x.0,x.1+1)] == '#' &&
            map.contains_key(&(x.0,x.1-1)) && map[&(x.0,x.1-1)] == '#')
        .collect();
    filtered.iter().fold(0, |acc, x| acc + x.0*x.1)
}

#[allow(dead_code)]
fn render(map : &HashMap<(usize, usize), char>) {
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

fn find_starting_point(map : &HashMap<(usize, usize), char>) -> (usize, usize) {
    map.keys().filter(|&x| map[x] == '^').next().unwrap().clone()
}

fn get_scaffold_traversal_path(map : &HashMap<(usize, usize), char>) -> String {
    let mut path = String::new();
    let mut curr_pos = find_starting_point(map);
    let mut curr_dir = map[&curr_pos];
    loop{
        match curr_dir {
            '^' => continue,
            '>' => continue,
            'v' => continue,
            '<' => continue,
            _ => panic!("Unexpected direction symbol encountered")
        }
    }
    path
}

