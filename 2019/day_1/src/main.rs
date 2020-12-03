use std::io::{BufReader, BufRead, Error};
use std::fs::File;

fn main() -> Result<(), Error> {
    let file = File::open("input.txt").expect("Failed to open file.");
    let reader = BufReader::new(file);
    let mut total_fuel : i32 = 0;

    for line in reader.lines() {
        let mass : i32 = line?.parse::<i32>().unwrap();
        total_fuel += recursive_fuel(mass);
    }
    println!("{}",total_fuel);
    Ok(())
}

fn recursive_fuel(mass: i32) -> i32 {
    let added_fuel : i32 = mass / 3 - 2;
    if added_fuel < 0 {
        return 0;
    }
    return added_fuel + recursive_fuel(added_fuel);
}
