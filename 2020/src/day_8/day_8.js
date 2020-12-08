"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const lodash_1 = require("lodash");
const isLoop = (input) => {
    let acc = 0;
    let pos = 0;
    let visited = new Set();
    while (!visited.has(pos)) {
        if (pos >= input.length) {
            return [false, acc];
        }
        visited.add(pos);
        let currLine = input[pos].split(' ');
        switch (currLine[0]) {
            case 'nop':
                pos++;
                continue;
            case 'acc':
                acc += Number(currLine[1]);
                pos++;
                continue;
            case 'jmp':
                pos += Number(currLine[1]);
                continue;
        }
    }
    return [true, acc];
};
const fixInput = (input) => {
    let inputIsLooping = true;
    let pos = 0;
    let acc = 0;
    while (inputIsLooping) {
        let inputCpy = lodash_1.cloneDeep(input);
        let currLine = inputCpy[pos];
        if (currLine.startsWith('nop')) {
            inputCpy[pos] = currLine.replace('nop', 'jmp');
        }
        else if (currLine.startsWith('jmp')) {
            inputCpy[pos] = currLine.replace('jmp', 'nop');
        }
        let result = isLoop(inputCpy);
        inputIsLooping = result[0];
        acc = result[1];
        pos++;
    }
    return acc;
};
let input = input_1.readInputToStringArr("./day_8/input.txt");
console.log(isLoop(input));
console.log(fixInput(input));
