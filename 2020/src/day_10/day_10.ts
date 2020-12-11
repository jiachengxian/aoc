import {readInputToStringArr} from '../input';

const getNumDifferences = (input: number[]): Map<number, number> => {
    let differences: Map<number, number> = new Map();
    let currJolt: number = 0;

    input = input.sort((a,b) => a-b);
    input.push(input[input.length-1]+3);

    for(let jolt of input){
        let diff: number = jolt - currJolt;
        let count: number = differences.get(diff) ?? 0;

        differences.set(diff, count+1);
        currJolt = jolt;
    }
    return differences;
}

const calcPartOne = (input: number[]): number => {
    let differences: Map<number, number> = getNumDifferences(input);
    return (differences.get(1) ?? 0) * (differences.get(3) ?? 0);
}

const splitByConscutiveSequences = (input: number[]): number[][] => {
    let sequences: number[][] = [];
    let currSeq: number[] = [0];
    let currJolt: number = 0;


    input = input.sort((a,b) => a-b);
    input.push(input[input.length-1]+3);

    for (let jolt of input){
        let diff: number = jolt-currJolt;
        //input seems to only have diff=1 or diff=3
        if (diff === 3){
            sequences.push(currSeq);
            currSeq = [];
        } 
        currSeq.push(jolt);
        currJolt = jolt;
    }
    sequences.push(currSeq);
    return sequences;
}

const calcCombinations = (sequences: number[][]): number => {
    let numComb: number = 1;

    for (let seq of sequences){
        let size:number = seq.length;

        switch(size){
            case 1:
            case 2:
                numComb = numComb*1;
                continue;
            case 3:
                //1c1 + 1c0 = 1 + 1 = 2
                numComb = numComb*2;
                continue;
            case 4:
                //2c2 + 2c1 + 2c0 = 1 + 2 + 1 = 4
                numComb = numComb*4;
                continue;
            case 5:
                //3c3 + 3c2 + 3c1 = 1 + 3 + 3 = 7
                //3c0 is invalid because the gap between the smallest and largest is 4
                numComb = numComb*7;
                continue;
            default:
                console.log(`unhandled case size : ${size}!`);
                continue;
        }
    }
    return numComb;
}

const calcPartTwo = (input:number[]): number => {
    let seq: number[][] = splitByConscutiveSequences(input);
    return calcCombinations(seq);
}

let input: number[] = readInputToStringArr("./day_10/input.txt").map(line => Number(line));
console.log(calcPartOne(input));
console.log(calcPartTwo(input));