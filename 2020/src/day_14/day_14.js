"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const MASK_SIZE = 36;
const decToBinaryStr = (input) => {
    return (Number(input) >>> 0).toString(2);
};
const padToMaskSize = (bin) => {
    return String(0).repeat(MASK_SIZE - bin.length) + bin;
};
const applyMask = (bitMask, val) => {
    let result = '';
    [...val].map((c, i) => {
        result += bitMask.charAt(i) === 'X' ? c : bitMask.charAt(i);
    });
    return result;
};
const applyMaskToMemAddr = (bitMask, memAddr) => {
    let results = [];
    let decoded = '';
    [...memAddr].map((c, i) => {
        decoded += bitMask.charAt(i) === '0' ? c : bitMask.charAt(i);
    });
    //push base (i.e. decoded memaddr w/ X's as 0s)
    let resultBase = parseInt(decoded.replace(/X/g, '0'), 2);
    results.push(resultBase);
    [...decoded].map((c, i) => {
        if (c === 'X') {
            let nextSet = [...results].map(v => v + Math.pow(2, MASK_SIZE - i - 1));
            results.push(...nextSet);
        }
    });
    return results;
};
const parsePartOne = (input) => {
    let map = new Map();
    let mask = '';
    let sum = 0;
    for (let line of input) {
        if (line[0].startsWith('mask')) {
            mask = line[1];
        }
        else if (line[0].startsWith('mem')) {
            let loc = Number(line[0].slice(4, -1));
            let val = padToMaskSize(decToBinaryStr(line[1]));
            map.set(loc, parseInt(applyMask(mask, val), 2));
        }
    }
    map.forEach((val, key) => sum += val);
    return sum;
};
const parsePartTwo = (input) => {
    let map = new Map();
    let mask = '';
    let sum = 0;
    for (let line of input) {
        if (line[0].startsWith('mask')) {
            mask = line[1];
        }
        else if (line[0].startsWith('mem')) {
            let loc = line[0].slice(4, -1);
            let memAddrs = applyMaskToMemAddr(mask, padToMaskSize(decToBinaryStr(loc)));
            memAddrs.map(addr => map.set(addr, Number(line[1])));
        }
    }
    map.forEach((val, key) => sum += val);
    return sum;
};
let input = input_1.readInputToStringArr("./day_14/input.txt")
    .map(line => line.split('=').map(part => part.trim()));
console.log(parsePartOne(input));
console.log(parsePartTwo(input));
