use std::collections::HashMap;
use std::collections::HashSet;
use std::io::{BufReader, BufRead};
use std::fs::File;
use std::cmp;

fn get_directional_vector(symbol : &str) -> (i32, i32){
    match symbol {
        "U" => return (0,1),
        "D" => return (0,-1),
        "L" => return (-1,0),
        "R" => return (1,0),
        _ => panic!("Unexpected direction symbol encountered!")
    }
}

fn generate_point_map(move_string : &String) -> HashMap<(i32, i32), i32> {
    let mut point_map = HashMap::new();
    let mut curr_pos = (0,0);
    let mut dist = 0;

    for action in move_string.trim().split(','){
        let dir_vector = get_directional_vector(&action[..1]);
        let &move_value = &action[1..].parse::<i32>().unwrap();
        for _i in 0..move_value{
            curr_pos.0 += dir_vector.0;
            curr_pos.1 += dir_vector.1;
            dist += 1;
            point_map.insert(curr_pos, dist);
        }
    }
    point_map
}

fn find_min_manhatten_dist(points : &HashSet<(i32, i32)>) -> i32 {
    let mut min = std::i32::MAX;
    for point in points.iter(){
        min = cmp::min(point.0.abs() + point.1.abs(), min);
    }
    min
}

fn find_min_weighted_dist(
    points : &HashSet<(i32, i32)>, 
    map_one: &HashMap<(i32, i32),i32>, 
    map_two: &HashMap<(i32, i32), i32>
) -> i32 {
    let mut min = std::i32::MAX;
    for point in points.iter(){
        min = cmp::min(map_one[point] + map_two[point], min)
    }
    min
}

fn main() {
    let file = File::open("input.txt").expect("Failed to open file.");
    let mut reader = BufReader::new(file);
    let mut wire_one = String::new();
    let mut wire_two = String::new();

    reader.read_line(&mut wire_one).expect("Failed to read line.");
    reader.read_line(&mut wire_two).expect("Failed to read line.");

    let map_one = generate_point_map(&wire_one);
    let map_two = generate_point_map(&wire_two);

    let key_set_one : HashSet<(i32, i32)> = map_one.keys().cloned().collect();
    let key_set_two : HashSet<(i32, i32)> = map_two.keys().cloned().collect();

    let intersect_set : HashSet<(i32, i32)> = key_set_one.intersection(&key_set_two).cloned().collect();
    
    let min_manhatten_dist = find_min_manhatten_dist(&intersect_set);
    println!("Part one answer: {}", min_manhatten_dist);

    let min_weighted_dist = find_min_weighted_dist(&intersect_set, &map_one, &map_two);
    println!("Part two answer: {}", min_weighted_dist);
}


