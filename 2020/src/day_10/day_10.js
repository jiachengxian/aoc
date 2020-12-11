"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const getNumDifferences = (input) => {
    var _a;
    let differences = new Map();
    let currJolt = 0;
    input = input.sort((a, b) => a - b);
    input.push(input[input.length - 1] + 3);
    for (let jolt of input) {
        let diff = jolt - currJolt;
        let count = (_a = differences.get(diff)) !== null && _a !== void 0 ? _a : 0;
        differences.set(diff, count + 1);
        currJolt = jolt;
    }
    return differences;
};
const calcPartOne = (input) => {
    var _a, _b;
    let differences = getNumDifferences(input);
    return ((_a = differences.get(1)) !== null && _a !== void 0 ? _a : 0) * ((_b = differences.get(3)) !== null && _b !== void 0 ? _b : 0);
};
const splitByConscutiveSequences = (input) => {
    let sequences = [];
    let currSeq = [0];
    let currJolt = 0;
    input = input.sort((a, b) => a - b);
    input.push(input[input.length - 1] + 3);
    for (let jolt of input) {
        let diff = jolt - currJolt;
        //input seems to only have diff=1 or diff=3
        if (diff === 3) {
            sequences.push(currSeq);
            currSeq = [];
        }
        currSeq.push(jolt);
        currJolt = jolt;
    }
    sequences.push(currSeq);
    return sequences;
};
const calcCombinations = (sequences) => {
    let numComb = 1;
    for (let seq of sequences) {
        let size = seq.length;
        switch (size) {
            case 1:
            case 2:
                numComb = numComb * 1;
                continue;
            case 3:
                //1c1 + 1c0 = 1 + 1 = 2
                numComb = numComb * 2;
                continue;
            case 4:
                //2c2 + 2c1 + 2c0 = 1 + 2 + 1 = 4
                numComb = numComb * 4;
                continue;
            case 5:
                //3c3 + 3c2 + 3c1 = 1 + 3 + 3 = 7
                //3c0 is invalid because the gap between the smallest and largest is 4
                numComb = numComb * 7;
                continue;
            default:
                console.log(`unhandled case size : ${size}!`);
                continue;
        }
    }
    return numComb;
};
const calcPartTwo = (input) => {
    let seq = splitByConscutiveSequences(input);
    return calcCombinations(seq);
};
let input = input_1.readInputToStringArr("./day_10/input.txt").map(line => Number(line));
console.log(calcPartOne(input));
console.log(calcPartTwo(input));
