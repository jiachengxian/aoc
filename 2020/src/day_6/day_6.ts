import {readInputToStringArr, mapFuncOnInputChunk} from '../input';

const countUniqueChars = (input: string[]): number => {
    let charSet: Set<string> = new Set();

    [...input.join('')]
        .filter(char => char!=' ')
        .forEach(char => {if(!charSet.has(char)) charSet.add(char);});
    
    return charSet.size;
}

const countAllPresentChars = (input: string[]): number => {
    let charMap: Map<string, number> = new Map();
    let sum: number = 0;

    input.forEach(line => {
        let charSet: Set<string> = new Set();
        [...line].forEach(char => {if(!charSet.has(char)) charSet.add(char);});
        
        charSet.forEach(char => {
            let count: number = charMap.get(char) ?? 0;
            charMap.set(char, count+1);
        })
    });

    charMap.forEach((value, key) => {
        if(value===input.length) sum++;
    });

    return sum;
}

const calcPartOne = (input: string[]): number => {
    let results: number[] = mapFuncOnInputChunk(input, countUniqueChars);
    let sum: number = results.reduce((sum, current) => sum+=current);
    return sum;
}

const calcPartTwo = (input: string[]): number => {
    let results: number[] = mapFuncOnInputChunk(input, countAllPresentChars);
    let sum: number = results.reduce((sum, current) => sum+=current);
    return sum;
}

let input: string[] = readInputToStringArr("./day_6/input.txt");
console.log(calcPartOne(input));
console.log(calcPartTwo(input));