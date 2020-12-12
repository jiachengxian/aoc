import {readInputToStringArr, printInput} from '../input';
import {cloneDeep} from 'lodash';

const isSeatOccupyable = (input:string[], xPos: number, yPos: number, useLineOfSight: boolean): boolean => {
    let numAdjOccupied: number = useLineOfSight 
        ? countLineOfSightSeats(input, xPos, yPos) : countAdjSeats(input, xPos, yPos);
    let seat: string = input[yPos][xPos];
    let MAX_SEATS: number = useLineOfSight ? 5 : 4;
    
    //different rules depending on curr seat value
    switch(seat){
        case 'L':
            return numAdjOccupied===0;
        case '#':
            return numAdjOccupied < MAX_SEATS;
        default:
            return false;
    }
}

const countAdjSeats = (input: string[], xPos: number, yPos: number): number => {
    let numAdjOccupied: number = 0;

    for (let x = xPos-1; x <= xPos+1; x++){
        for (let y = yPos-1; y <= yPos+1; y++){
            //ignore outside of bounds
            if(x < 0 || y < 0 || x >= input[0].length || y >= input.length) continue;
            //ignore seat in question (Center)
            if(x===xPos && y===yPos) continue;

            if(input[y][x]==='#') numAdjOccupied++;
        }
    }

    return numAdjOccupied;
}

const countLineOfSightSeats = (input: string[], xPos: number, yPos: number): number => {
    let numOccupied: number = 0;

    let vectors: number[][] = [-1, 0, 1].map(x => [-1, 0, 1].map(y => [x, y])).flat();

    vectors.filter(v=> !(v[0]===0 && v[1]===0)).map(v => {
        let x: number = xPos + v[0];
        let y: number = yPos + v[1];

        while(x >= 0 && x < input[0].length && y >= 0 && y < input.length){
            if (input[y][x] === '#'){
                numOccupied++;
                break;
            } else if (input[y][x] === 'L'){
                break;
            }
            x += v[0];
            y += v[1];
        }
    });

    return numOccupied;
}

const calculateSeating = (input:string[], useLineOfSight: boolean): [string[], boolean] => {
    let newSeating: string[] = [];
    let currRow: string = '';
    let isSeatingChanged: boolean = false;

    input.map((line, y) => {
        [...line].map((char, x)=> {
            let newChar: string = char;
            if(char==='#' || char==='L'){
                newChar = isSeatOccupyable(input, x, y, useLineOfSight) ? '#' : 'L';
                isSeatingChanged = isSeatingChanged || !(newChar===char);
            }
            currRow += newChar;
        });
        newSeating.push(currRow);
        currRow = '';
    });

    return [newSeating, isSeatingChanged];
}

const iterateSeating = (input:string[], useLineOfSight: boolean): number => {
    let newSeating: string[] = cloneDeep(input);
    let iterate: boolean = true;

    while (iterate){
        let result: [string[], boolean] = calculateSeating(newSeating, useLineOfSight);
        newSeating = result[0];
        iterate = result[1];
    }
    return countOccupiedSeats(newSeating);
}

const countOccupiedSeats = (input:string[]): number => {
    let sum: number = 0;
    input.map(line=>[...line].filter(seat => seat==='#').map(seat => sum++));
    return sum;
}

let input: string[] = readInputToStringArr("./day_11/input.txt");

console.log(`Part one: ${iterateSeating(input, false)}`);
console.log(`Part two: ${iterateSeating(input, true)}`);