"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const parseActiveBuses = (input) => {
    return input.split(',').filter(id => id != 'x').map(id => Number(id));
};
const parseActiveBusesWithIndex = (input) => {
    return input.split(',').map((id, index) => [id, index])
        .filter(b => b[0] != 'x')
        .map(b => [Number(b[0]), Number(b[1])]);
};
const findClosestNextBus = (departure, busIds) => {
    let busTimes = busIds.map(id => Math.ceil(departure / id) * id);
    let closestTime = Math.min(...busTimes);
    return [busIds[busTimes.indexOf(closestTime)], closestTime];
};
const calcPartOne = (input) => {
    let departure = Number(input[0]);
    let result = findClosestNextBus(departure, parseActiveBuses(input[1]));
    return result[0] * (result[1] - departure);
};
const calcPartTwo = (input) => {
    let busIds = parseActiveBusesWithIndex(input[1]);
    let currBase = busIds[0][0];
    let currTime = currBase;
    for (let ids of busIds.slice(1)) {
        while ((currTime + ids[1]) % ids[0] != 0) {
            currTime += currBase;
        }
        currBase = currBase * ids[0];
    }
    return currTime;
};
let input = input_1.readInputToStringArr("./day_13/input.txt");
console.log(calcPartOne(input));
console.log(calcPartTwo(input));
