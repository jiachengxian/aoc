"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const countUniqueChars = (input) => {
    let charSet = new Set();
    [...input.join('')]
        .filter(char => char != ' ')
        .forEach(char => { if (!charSet.has(char))
        charSet.add(char); });
    return charSet.size;
};
const countAllPresentChars = (input) => {
    let charMap = new Map();
    let sum = 0;
    input.forEach(line => {
        let charSet = new Set();
        [...line].forEach(char => { if (!charSet.has(char))
            charSet.add(char); });
        charSet.forEach(char => {
            var _a;
            let count = (_a = charMap.get(char)) !== null && _a !== void 0 ? _a : 0;
            charMap.set(char, count + 1);
        });
    });
    charMap.forEach((value, key) => {
        if (value === input.length)
            sum++;
    });
    return sum;
};
const calcPartOne = (input) => {
    let results = input_1.mapFuncOnInputChunk(input, countUniqueChars);
    let sum = results.reduce((sum, current) => sum += current);
    return sum;
};
const calcPartTwo = (input) => {
    let results = input_1.mapFuncOnInputChunk(input, countAllPresentChars);
    let sum = results.reduce((sum, current) => sum += current);
    return sum;
};
let input = input_1.readInputToStringArr("./day_6/input.txt");
console.log(calcPartOne(input));
console.log(calcPartTwo(input));
