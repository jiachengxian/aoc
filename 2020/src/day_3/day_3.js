"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const treesEncountered = (xMov, yMov, input) => {
    let currYPos = yMov;
    let currXPos = 0;
    let numTrees = 0;
    while (currYPos < input.length) {
        let currLine = input[currYPos];
        currXPos = (currXPos + xMov) % currLine.length;
        if (currLine[currXPos] === '#')
            numTrees++;
        currYPos += yMov;
    }
    return numTrees;
};
const calcPartTwo = (input) => {
    return treesEncountered(1, 1, input)
        * treesEncountered(3, 1, input)
        * treesEncountered(5, 1, input)
        * treesEncountered(7, 1, input)
        * treesEncountered(1, 2, input);
};
let input = input_1.readInputToStringArr("./day_3/input.txt");
console.log("Part one answer: " + treesEncountered(3, 1, input));
console.log("Part two answer: " + calcPartTwo(input));
