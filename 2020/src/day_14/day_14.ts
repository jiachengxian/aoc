import {readInputToStringArr} from '../input';

const MASK_SIZE = 36;

const decToBinaryStr = (input: string): string => {
    return (Number(input)>>>0).toString(2);
}

const padToMaskSize = (bin: string): string => {
    return String(0).repeat(MASK_SIZE - bin.length) + bin;
}

const applyMask = (bitMask: string, val: string): string => {
    let result: string = '';
    [...val].map((c, i) => {
        result += bitMask.charAt(i)==='X' ? c : bitMask.charAt(i);
    });
    return result;
}

const applyMaskToMemAddr = (bitMask: string, memAddr: string): number[] => {
    let results: number[] = [];
    let decoded: string = '';
    [...memAddr].map((c, i) => {
        decoded += bitMask.charAt(i)==='0' ? c : bitMask.charAt(i);
    });

    //push base (i.e. decoded memaddr w/ X's as 0s)
    let resultBase: number = parseInt(decoded.replace(/X/g, '0'), 2);
    results.push(resultBase);
    
    [...decoded].map((c, i) => {
        if(c==='X'){
            let nextSet: number[] = [...results].map(v => v + Math.pow(2, MASK_SIZE - i - 1));
            results.push(...nextSet);
        }
    });

    return results;
}

const parsePartOne = (input: string[][]): number => {
    let map: Map<number, number> = new Map();
    let mask: string = '';
    let sum: number = 0;

    for(let line of input){
        if (line[0].startsWith('mask')){
            mask = line[1];
        }else if (line[0].startsWith('mem')){
            let loc: number = Number(line[0].slice(4, -1));
            let val: string = padToMaskSize(decToBinaryStr(line[1]));
            map.set(loc, parseInt(applyMask(mask, val), 2));
        }
    }

    map.forEach((val, key) => sum += val);
    return sum;
}

const parsePartTwo = (input: string[][]): number => {
    let map: Map<number, number> = new Map();
    let mask: string = '';
    let sum: number = 0;

    for(let line of input){
        if (line[0].startsWith('mask')){
            mask = line[1];
        }else if (line[0].startsWith('mem')){
            let loc: string = line[0].slice(4, -1);
            let memAddrs: number[] = applyMaskToMemAddr(mask, padToMaskSize(decToBinaryStr(loc)));
            memAddrs.map(addr => map.set(addr, Number(line[1])));
        }
    }

    map.forEach((val, key) => sum += val);
    return sum;
}

let input: string[][] = readInputToStringArr("./day_14/input.txt")
    .map(line => line.split('=').map(part => part.trim()));

console.log(parsePartOne(input));
console.log(parsePartTwo(input));
