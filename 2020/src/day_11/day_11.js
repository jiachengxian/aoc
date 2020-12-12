"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const lodash_1 = require("lodash");
const isSeatOccupyable = (input, xPos, yPos, useLineOfSight) => {
    let numAdjOccupied = useLineOfSight
        ? countLineOfSightSeats(input, xPos, yPos) : countAdjSeats(input, xPos, yPos);
    let seat = input[yPos][xPos];
    let MAX_SEATS = useLineOfSight ? 5 : 4;
    //different rules depending on curr seat value
    switch (seat) {
        case 'L':
            return numAdjOccupied === 0;
        case '#':
            return numAdjOccupied < MAX_SEATS;
        default:
            return false;
    }
};
const countAdjSeats = (input, xPos, yPos) => {
    let numAdjOccupied = 0;
    for (let x = xPos - 1; x <= xPos + 1; x++) {
        for (let y = yPos - 1; y <= yPos + 1; y++) {
            //ignore outside of bounds
            if (x < 0 || y < 0 || x >= input[0].length || y >= input.length)
                continue;
            //ignore seat in question (Center)
            if (x === xPos && y === yPos)
                continue;
            if (input[y][x] === '#')
                numAdjOccupied++;
        }
    }
    return numAdjOccupied;
};
const countLineOfSightSeats = (input, xPos, yPos) => {
    let numOccupied = 0;
    let vectors = [-1, 0, 1].map(x => [-1, 0, 1].map(y => [x, y])).flat();
    vectors.filter(v => !(v[0] === 0 && v[1] === 0)).map(v => {
        let x = xPos + v[0];
        let y = yPos + v[1];
        while (x >= 0 && x < input[0].length && y >= 0 && y < input.length) {
            if (input[y][x] === '#') {
                numOccupied++;
                break;
            }
            else if (input[y][x] === 'L') {
                break;
            }
            x += v[0];
            y += v[1];
        }
    });
    return numOccupied;
};
const calculateSeating = (input, useLineOfSight) => {
    let newSeating = [];
    let currRow = '';
    let isSeatingChanged = false;
    input.map((line, y) => {
        [...line].map((char, x) => {
            let newChar = char;
            if (char === '#' || char === 'L') {
                newChar = isSeatOccupyable(input, x, y, useLineOfSight) ? '#' : 'L';
                isSeatingChanged = isSeatingChanged || !(newChar === char);
            }
            currRow += newChar;
        });
        newSeating.push(currRow);
        currRow = '';
    });
    return [newSeating, isSeatingChanged];
};
const iterateSeating = (input, useLineOfSight) => {
    let newSeating = lodash_1.cloneDeep(input);
    let iterate = true;
    while (iterate) {
        let result = calculateSeating(newSeating, useLineOfSight);
        newSeating = result[0];
        iterate = result[1];
    }
    return countOccupiedSeats(newSeating);
};
const countOccupiedSeats = (input) => {
    let sum = 0;
    input.map(line => [...line].filter(seat => seat === '#').map(seat => sum++));
    return sum;
};
let input = input_1.readInputToStringArr("./day_11/input.txt");
console.log(`Part one: ${iterateSeating(input, false)}`);
console.log(`Part two: ${iterateSeating(input, true)}`);
