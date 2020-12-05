"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const getRow = (input) => {
    let pos = 0;
    let start = 0;
    let end = 127;
    while (end - start > 1) {
        let move = input[pos];
        switch (move) {
            case 'F':
                end = end - (end - start + 1) / 2;
                break;
            case 'B':
                start = start + (end - start + 1) / 2;
                break;
            default:
                console.log("Unexpected character encoutered: " + move);
                return -1;
        }
        pos++;
    }
    return input[pos] === 'F' ? start : end;
};
const getColumn = (input) => {
    let pos = 0;
    let start = 0;
    let end = 7;
    while (end - start > 1) {
        let move = input[pos];
        switch (move) {
            case 'L':
                end = end - (end - start + 1) / 2;
                break;
            case 'R':
                start = start + (end - start + 1) / 2;
                break;
            default:
                console.log("Unexpected character encoutered: " + move);
                return -1;
        }
        pos++;
    }
    return input[pos] === 'L' ? start : end;
};
const getSeatId = (input) => {
    return getRow(input.slice(0, -3)) * 8 + getColumn(input.slice(-3));
};
const getPartOne = (input) => {
    return input.map(line => getSeatId(line)).sort((a, b) => a - b)[input.length - 1];
};
const getPartTwo = (input) => {
    let sorted = input.map(line => getSeatId(line)).sort((a, b) => a - b);
    for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] - sorted[i] > 1) {
            return sorted[i] + 1;
        }
    }
    return -1;
};
let input = input_1.readInputToStringArr("./day_5/input.txt");
console.log(getPartOne(input));
console.log(getPartTwo(input));
