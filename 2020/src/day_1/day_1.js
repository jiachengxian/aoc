"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const getPairs = (arr) => arr.map((val, i) => arr.slice(i + 1).map((nextVal) => [val, nextVal])).flat();
const calcPartOne = (pairs) => {
    let match = pairs.filter((pair) => Number(pair[0]) + Number(pair[1]) === 2020)[0];
    return Number(match[0]) * Number(match[1]);
};
const calcPartTwo = (input) => {
    //TODO - clean this up using O(n^2) implementation
    for (var x = 0; x < input.length - 2; x++) {
        for (var y = x + 1; y < input.length - 1; y++) {
            for (var z = y + 1; z < input.length; z++) {
                if (Number(input[x]) + Number(input[y]) + Number(input[z]) == 2020) {
                    return Number(input[x]) * Number(input[y]) * Number(input[z]);
                }
            }
        }
    }
};
let input = input_1.readInputToStringArr("./day_1/input.txt");
let pairs = getPairs(input);
console.log("Part one answer: " + calcPartOne(pairs));
console.log("Part two answer: " + calcPartTwo(input));
