"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const lodash_1 = require("lodash");
class Field {
    constructor(name, ranges) {
        this.isWithinRange = (val) => {
            let ret = (val >= this.range1[0] && val <= this.range1[1])
                || (val >= this.range2[0] && val <= this.range2[1]);
            return ret;
        };
        this.toString = () => {
            return this.name;
        };
        this.name = name;
        let splitRanges = ranges.split('or').map(r => r.trim());
        let range1 = splitRanges[0].split('-').map(n => Number(n));
        let range2 = splitRanges[1].split('-').map(n => Number(n));
        this.range1 = [range1[0], range1[1]];
        this.range2 = [range2[0], range2[1]];
    }
}
const parseInput = (input) => {
    let inputSegments = [];
    let currSegment = [];
    for (let line of input) {
        if (line === '') {
            inputSegments.push(currSegment);
            currSegment = [];
            continue;
        }
        else if (line.startsWith('your ticket') || line.startsWith('nearby tickets')) {
            continue;
        }
        currSegment.push(line);
    }
    if (currSegment.length != 0)
        inputSegments.push(currSegment);
    return inputSegments;
};
const createSetOfValidValues = (input) => {
    let rangeValues = new Set();
    let ranges = input.map(line => line.split(':')[1])
        .map(range => range.split('or').map(r => r.trim())).flat();
    for (let range of ranges) {
        let nums = range.split('-').map(n => Number(n));
        for (let i = nums[0]; i < nums[1] + 1; i++) {
            rangeValues.add(i);
        }
    }
    return rangeValues;
};
const parseAsFields = (input) => {
    return input.map(line => line.split(':'))
        .map(line => new Field(line[0], line[1]));
};
const findInvalidValues = (input, validSet) => {
    let invalidNums = [];
    input.map(line => line.split(',').map(n => Number(n)).map(n => {
        if (!validSet.has(n))
            invalidNums.push(n);
    }));
    return invalidNums;
};
const filterValidTickets = (input, validSet) => {
    let invalidRows = new Set();
    input.map(line => line.split(',').map(n => Number(n)).map(n => {
        if (!validSet.has(n))
            invalidRows.add(line);
    }));
    return input.filter(line => !invalidRows.has(line));
};
const calcPartOne = (input) => {
    let validNums = createSetOfValidValues(input[0]);
    let invalidNums = findInvalidValues(input[1].concat(input[2]), validNums);
    let sum = invalidNums.length === 0 ? 0 : invalidNums.reduce((sum, curr) => sum += curr);
    return sum;
};
const calcPartTwo = (input) => {
    let validNums = createSetOfValidValues(input[0]);
    let validTickets = filterValidTickets(input[1].concat(input[2]), validNums);
    let result = 1;
    let fields = parseAsFields(input[0]);
    let possibleFields = new Map();
    validTickets.map(ticket => ticket.split(',').map((val, i) => {
        var _a;
        let currPossibleFields = (_a = possibleFields.get(i)) !== null && _a !== void 0 ? _a : lodash_1.cloneDeep(fields);
        let reducedFields = [];
        for (let field of currPossibleFields) {
            if (field.isWithinRange(Number(val))) {
                reducedFields.push(field);
            }
        }
        possibleFields.set(i, reducedFields);
    }));
    possibleFields = reduceFields(possibleFields);
    let myTicket = validTickets[0].split(',').map(v => Number(v));
    possibleFields.forEach((val, key) => {
        if (val[0].name.startsWith('departure')) {
            result = result * myTicket[key];
        }
    });
    return result;
};
const removeField = (toRemove, fields) => {
    fields.forEach((val, key) => {
        if (val.length != 1) {
            let reducedFields = val.filter(v => v.name != toRemove.name);
            fields.set(key, reducedFields);
        }
    });
    return fields;
};
const reduceFields = (fields) => {
    let found = new Set();
    while (true) {
        let singleFields = [...fields.values()].filter(v => v.length === 1);
        if (singleFields.length === [...fields.keys()].length) {
            break;
        }
        let toRemove = singleFields.map(l => l[0]).filter(f => !found.has(f))[0];
        if (toRemove === undefined) {
            break;
        }
        found.add(toRemove);
        fields = removeField(toRemove, fields);
    }
    return fields;
};
let input = parseInput(input_1.readInputToStringArr("./day_16/input.txt"));
console.log(calcPartOne(input));
console.log(calcPartTwo(input));
