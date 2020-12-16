"use strict";
const initializeMap = (input) => {
    let map = new Map();
    input.map((num, i) => map.set(num, i + 1));
    return map;
};
const takeTurn = (map, turn, lastNum) => {
    let result = map.get(lastNum);
    if (result != undefined) {
        result = turn - result;
        map.set(lastNum, turn);
    }
    else {
        result = 0;
        map.set(lastNum, turn);
    }
    return result;
};
const runGame = (input, totalTurns) => {
    let map = initializeMap(input);
    //start game assuming all turns involving initial number set has passed
    let nextNum = 0;
    let turn = input.length + 1;
    while (turn < totalTurns) {
        nextNum = takeTurn(map, turn, nextNum);
        turn++;
    }
    return nextNum;
};
const input = [11, 18, 0, 20, 1, 7, 16];
console.log(runGame(input, 2020));
console.log(runGame(input, 30000000));
