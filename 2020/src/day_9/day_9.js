"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const isSummableFromPreamble = (input, target) => {
    //sort input
    input = input.sort((a, b) => a - b);
    //pointers to low/high val
    let i = 0, j = input.length - 1;
    while (j > i) {
        if (input[j] + input[i] > target) {
            j--;
        }
        else if (input[j] + input[i] < target) {
            i++;
        }
        else {
            return true;
        }
    }
    return false;
};
const findUnsummable = (input, preambleSize) => {
    let pos = preambleSize;
    while (pos + 1 < input.length) {
        let currWindow = input.slice(pos - preambleSize, pos);
        if (!isSummableFromPreamble(currWindow, input[pos])) {
            return input[pos];
        }
        pos++;
    }
    return null;
};
const findContiguousRange = (input, target) => {
    //pointers to start/end of contiguous range
    let i = 0, j = 0;
    let currSum = input[i];
    while (i < input.length && j < input.length && i <= j) {
        if (currSum < target) {
            j++;
            currSum += input[j];
        }
        else if (currSum > target) {
            currSum -= input[i];
            i++;
        }
        else {
            return input.slice(i, j + 1);
        }
    }
    return null;
};
const calcPartTwo = (contiguousRange) => {
    contiguousRange = contiguousRange.sort((a, b) => a - b);
    return contiguousRange[0] + contiguousRange[contiguousRange.length - 1];
};
let input = input_1.readInputToStringArr("./day_9/input.txt").map(line => Number(line));
let partOne = (_a = findUnsummable(input, 25)) !== null && _a !== void 0 ? _a : -1;
let contiguousRange = (_b = findContiguousRange(input, partOne)) !== null && _b !== void 0 ? _b : [];
console.log(`Part one answer: ${partOne}`);
console.log(`Part two answer: ${calcPartTwo(contiguousRange)}`);
