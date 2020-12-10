import {readInputToStringArr} from '../input';

const isSummableFromPreamble = (input: number[], target: number): boolean => {
    //sort input
    input = input.sort((a,b) => a-b);

    //pointers to low/high val
    let i: number = 0, j: number = input.length-1;
    while(j > i){
        if (input[j] + input[i] > target){
            j--;
        } else if (input[j] + input[i] < target){
            i++;
        } else {
            return true;
        }
    }
    return false;
}

const findUnsummable = (input: number[], preambleSize: number): number | null => {
    let pos: number = preambleSize;

    while(pos + 1 < input.length){
        let currWindow: number[] = input.slice(pos - preambleSize, pos);
        if (!isSummableFromPreamble(currWindow, input[pos])){
            return input[pos];
        }
        pos++;
    }

    return null;
}

const findContiguousRange = (input: number[], target: number): number[] | null => {
    //pointers to start/end of contiguous range
    let i: number = 0, j: number = 0;
    let currSum: number = input[i];

    while (i < input.length && j < input.length && i<=j){
        if(currSum < target){
            j++;
            currSum += input[j];
        } else if (currSum > target){
            currSum -= input[i];
            i++;
        } else {
            return input.slice(i,j+1);
        }
    }

    return null;
}

const calcPartTwo = (contiguousRange: number[]): number => {
    contiguousRange = contiguousRange.sort((a,b) => a-b);
    return contiguousRange[0] + contiguousRange[contiguousRange.length-1];
}

let input: number[] = readInputToStringArr("./day_9/input.txt").map(line => Number(line));

let partOne: number = findUnsummable(input, 25) ?? -1;
let contiguousRange = findContiguousRange(input, partOne) ?? [];

console.log(`Part one answer: ${partOne}`);
console.log(`Part two answer: ${calcPartTwo(contiguousRange)}`);