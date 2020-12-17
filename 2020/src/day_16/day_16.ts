import {readInputToStringArr} from '../input';
import {cloneDeep} from 'lodash';

class Field {
    name: string;
    range1: [number, number];
    range2: [number, number];

    constructor(name: string, ranges: string){
        this.name = name;

        let splitRanges: string[] = ranges.split('or').map(r => r.trim());
        let range1: number[] = splitRanges[0].split('-').map(n => Number(n));
        let range2: number[] = splitRanges[1].split('-').map(n => Number(n));

        this.range1 = [range1[0], range1[1]];
        this.range2 = [range2[0], range2[1]];
    }

    isWithinRange = (val: number) => {
        let ret: boolean = (val >= this.range1[0] && val <= this.range1[1])
            || (val >= this.range2[0] && val <= this.range2[1]);
        return ret;
    }

    toString = () => {
        return this.name;
    }
}

const parseInput = (input: string[]): string[][] => {
    let inputSegments: string[][] = [];
    let currSegment: string[] = [];

    for(let line of input){
        if(line===''){
            inputSegments.push(currSegment);
            currSegment = [];
            continue;
        }else if (line.startsWith('your ticket') || line.startsWith('nearby tickets')){
            continue;
        }
        currSegment.push(line);
    }

    if(currSegment.length!= 0) inputSegments.push(currSegment);
    return inputSegments;
}

const createSetOfValidValues = (input: string[]): Set<number> => {
    let rangeValues: Set<number> = new Set();
    let ranges: string[] = input.map(line => line.split(':')[1])
        .map(range => range.split('or').map(r=>r.trim())).flat();

    for(let range of ranges){
        let nums: number[] = range.split('-').map(n => Number(n));
        for (let i = nums[0]; i < nums[1] + 1; i++){
            rangeValues.add(i);
        }
    }
    return rangeValues;
}

const parseAsFields = (input: string[]): Field[] => {
    return input.map(line => line.split(':'))
        .map(line => new Field(line[0], line[1]));
}

const findInvalidValues = (input: string[], validSet: Set<number>): number[] => {
    let invalidNums: number[] = [];
    input.map(line => line.split(',').map(n => Number(n)).map(n => {
        if(!validSet.has(n)) invalidNums.push(n);
    }));
    return invalidNums;
}

const filterValidTickets = (input: string[], validSet: Set<number>): string[] => {
    let invalidRows: Set<string> = new Set();
    input.map(line => line.split(',').map(n => Number(n)).map(n => {
        if(!validSet.has(n)) invalidRows.add(line)
    }));
    return input.filter(line => !invalidRows.has(line));
}

const calcPartOne = (input: string[][]): number => {
    let validNums: Set<number> = createSetOfValidValues(input[0]);

    let invalidNums: number[] = findInvalidValues(input[1].concat(input[2]), validNums);

    let sum: number = invalidNums.length===0 ? 0 : invalidNums.reduce((sum, curr) => sum+= curr);
    return sum;
}

const calcPartTwo = (input: string[][]): number => {
    let validNums: Set<number> = createSetOfValidValues(input[0]);
    let validTickets: string[] = filterValidTickets(input[1].concat(input[2]), validNums);
    let result: number = 1;

    let fields: Field[] = parseAsFields(input[0]);
    let possibleFields: Map<number, Field[]> = new Map();

    validTickets.map(ticket => ticket.split(',').map((val, i) => {
        let currPossibleFields: Field[] = possibleFields.get(i) ?? cloneDeep(fields);
        let reducedFields: Field[] = [];
        for (let field of currPossibleFields){
            if(field.isWithinRange(Number(val))){
                reducedFields.push(field);
            }
        }
        possibleFields.set(i, reducedFields);
    }));

    possibleFields = reduceFields(possibleFields);
    
    let myTicket: number[] = validTickets[0].split(',').map(v => Number(v));
    possibleFields.forEach((val, key)=> {
        if(val[0].name.startsWith('departure')){
            result = result * myTicket[key];
        }
    });
    return result;
}

const removeField = (toRemove: Field, fields: Map<number, Field[]>): Map<number, Field[]> => {
    fields.forEach((val, key) => {
        if(val.length!=1){
            let reducedFields = val.filter(v => v.name!=toRemove.name);
            fields.set(key, reducedFields);
        }
    })
    return fields;
}

const reduceFields = (fields: Map<number, Field[]>): Map<number, Field[]> => {
    let found: Set<Field> = new Set();
    while(true){
        let singleFields: Field[][] = [...fields.values()].filter(v => v.length === 1);
        if(singleFields.length === [...fields.keys()].length){
            break;
        }
        let toRemove: Field | undefined = singleFields.map(l => l[0]).filter(f => !found.has(f))[0];
        found.add(toRemove);
        fields = removeField(toRemove, fields);
    }
    return fields;
}

let input: string[][] = parseInput(readInputToStringArr("./day_16/input.txt"));

console.log(calcPartOne(input));
console.log(calcPartTwo(input));
