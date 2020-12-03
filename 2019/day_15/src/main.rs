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
    println!("Fewest number of steps to reach oxygen system: {}", part_1.0);
    println!("Oxygen system at {:?}", part_1.1);
    let part_2 = fill_oxygen(&mut explored, part_1.1);
    println!("Number of minutes to fill space is: {} minutes.", part_2);
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

fn find_min_dist(data : Vec<i64>, explored: &mut HashMap<(i32,i32),&str>) -> (usize, (i32, i32)){
    let mut pq = BinaryHeap::new();
    let start_pos = (0,0);
    let mut ret = (0, start_pos);
    explored.insert(start_pos,".");
    pq.push(Node{dist: 0, position: start_pos, data: data.clone(), ins_ptr: 0, rel_base: 0});

    //djikstra's w/ binary heap and custom Ord/Partial_Ord impl
    while !pq.is_empty(){
        let curr_node = pq.pop().unwrap();
        let curr_pos = curr_node.position;
        for i in 1..5{
            let mut intcode = intcode::IntCode::new(curr_node.data.clone(), curr_node.ins_ptr, curr_node.rel_base, i);
            let result = intcode.run();
            let output = result.0;
            let new_pos = match i {
                1 => (curr_pos.0 + 1, curr_pos.1),
                2 => (curr_pos.0 - 1, curr_pos.1),
                3 => (curr_pos.0, curr_pos.1 - 1),
                4 => (curr_pos.0, curr_pos.1 + 1),
                _ => panic!("Unexpected input type encontered")
            };
            if explored.contains_key(&new_pos){
                continue;
            }
            match output {
                0 => {
                    explored.insert(new_pos, "#");
                    continue;  
                },
                1 => {
                    pq.push(Node{dist:curr_node.dist + 1, position: new_pos, data: result.3.clone(), ins_ptr: result.1, rel_base: result.2});
                    explored.insert(new_pos, ".");
                },
                2 => {
                    explored.insert(new_pos, "2");
                    ret = (curr_node.dist + 1, new_pos);
                },
                _ => panic!("Unexpected output type encountered")
            };
            //animate(explored, false);
        }
    }
    ret
}

fn fill_oxygen(explored: &mut HashMap<(i32,i32),&str>, start: (i32, i32)) -> usize{
    let mut unfilled = Vec::new();
    let mut minutes = 0;
    unfilled.push(start);
    //bfs with depth
    while !unfilled.is_empty(){
        let mut next_min = Vec::new();
        for pos in unfilled.iter(){
            let neighbors = [
                (pos.0 + 1, pos.1), 
                (pos.0 - 1, pos.1), 
                (pos.0, pos.1 + 1), 
                (pos.0, pos.1 - 1)
            ];
            for neighbor_pos in neighbors.iter(){
                if explored.contains_key(&neighbor_pos) && explored[&neighbor_pos] == "."{
                    explored.insert(*neighbor_pos, "O");
                    next_min.push(neighbor_pos.clone());
                }
            }
        }
        //animate(explored, true);
        unfilled = next_min.clone();
        minutes+=1;
    }
    //extra minute added by last iteration
    minutes - 1
}

#[allow(dead_code)]
fn animate(explored: &mut HashMap<(i32,i32),&str>, has_delay: bool){
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
            }else if explored[&(x,y)] == "2" || explored[&(x,y)] == "O"{
                line.push('O');
            }
        }
        println!("{}",line);
    }
    //animation delay
    if has_delay{
        std::thread::sleep(std::time::Duration::from_millis(100));
    }
}
