use std::io::Error;
use std::fs;
use std::cmp::Ordering;
use std::collections::BinaryHeap;

mod intcode;


fn main() {
    let input = fs::read_to_string("input.txt").expect("Failed to read file");
    let mut _numbers : Vec<i64> = 
        input.trim()
            .split(',')
            .map(|s| s.parse::<i64>().unwrap())
            .collect();

    let mut intcode = intcode::IntCode::new(_numbers.to_vec(), 0, 0, 0);
    let mut halt = false;
}

fn find_min_dist(intcode : &mut intcode::IntCode){
    let mut halt = false;
    let mut pq = BinaryHeap::new();
    pq.push(Node{dist: 0, position: (0,0)});
    while !halt{
        let curr_pos = pq.pop();
        for i in 1..5{
            intcode.set_input(i);
            let result = intcode.run();
            let output = result.0;
            halt = result.4;
        }
    }
}

#[derive(Copy, Clone, Eq, PartialEq)]
struct Node {
    dist: usize,
    position: (i32, i32)
}

impl Ord for Node {
    fn cmp(&self, other: &Node) -> Ordering {
        other.dist.cmp(&self.dist).then_with(|| self.position.cmp(&other.position))
    }
}

impl PartialOrd for Node {
    fn partial_cmp(&self, other: &Node) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}
