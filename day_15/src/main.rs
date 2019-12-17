use std::io::Error;
use std::fs;
use std::cmp::Ordering;
use std::collections::BinaryHeap;
use std::collections::HashMap;

mod intcode;


fn main() {
    let input = fs::read_to_string("input.txt").expect("Failed to read file");
    let mut _numbers : Vec<i64> = 
        input.trim()
            .split(',')
            .map(|s| s.parse::<i64>().unwrap())
            .collect();
    let mut explored = HashMap::new();
    let part_1 = find_min_dist(_numbers.to_vec(), &mut explored);
    println!("part 1: {}",part_1);
}

fn find_min_dist(data : Vec<i64>, explored: &mut HashMap<(i32,i32),&str>) -> usize{
    let mut pq = BinaryHeap::new();
    let mut ret = 0;
    explored.insert((0,0),".");
    pq.push(Node{dist: 0, position: (0,0), data: data.clone(), ins_ptr: 0, rel_base: 0});
    while !pq.is_empty(){
        let curr_node = pq.pop().unwrap();
        let curr_pos = curr_node.position;
        //println!("Current position is: {:?}", curr_pos);
        for i in 1..5{
            let mut intcode = intcode::IntCode::new(curr_node.data.clone(), curr_node.ins_ptr, curr_node.rel_base, i);
            let result = intcode.run();
            let output = result.0;
            let new_pos = match i {
                1 => (curr_pos.0 + 1, curr_pos.1),
                2 => (curr_pos.0 - 1, curr_pos.1),
                3 => (curr_pos.0, curr_pos.1 -1),
                4 => (curr_pos.0, curr_pos.1 + 1),
                _ => panic!("Unexpected input type encontered")
            };
            if explored.contains_key(&new_pos){
                continue;
            }
            match output {
                0 => {
                    explored.insert(new_pos, "#");
                    //println!("Hit wall at {:?}", new_pos);
                    continue;  
                },
                1 => {
                    pq.push(Node{dist:curr_node.dist + 1, position: new_pos, data: result.3.clone(), ins_ptr: result.1, rel_base: result.2});
                    explored.insert(new_pos, ".");
                    //println!("Successfully moved to {:?}", new_pos);
                },
                2 => {
                    explored.insert(new_pos, "2");
                    //println!("Found trasure at {:?}", new_pos);
                    ret = curr_node.dist + 1;
                },
                _ => panic!("Unexpected output type encountered")
            };
            //print out exploration
            for y in (-25..25).rev(){
                let mut line = String::new();
                for x in -25..25{
                    if !explored.contains_key(&(x,y)){
                        line.push(' ');
                    }else if explored[&(x,y)] == "#" {
                        line.push('#');
                    }else if explored[&(x,y)] == "."{
                        line.push('.');
                    }else if explored[&(x,y)] == "2"{
                        line.push('O');
                    }
                }
                println!("{}",line);
            }
            //animation delay
            //std::thread::sleep(std::time::Duration::from_millis(100));
        }
    }
    ret
}

#[derive(Clone, Eq, PartialEq)]
struct Node {
    pub dist: usize,
    pub position: (i32, i32),
    pub data: Vec<i64>,
    pub ins_ptr: usize,
    pub rel_base: i64
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
