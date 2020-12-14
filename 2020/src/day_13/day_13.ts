import {readInputToStringArr} from '../input';

const parseActiveBuses = (input: string): number[] => {
    return input.split(',').filter(id=> id!='x').map(id => Number(id));
}

const parseActiveBusesWithIndex = (input: string): number[][] => {
    return input.split(',').map((id, index) => [id, index])
        .filter(b => b[0]!='x')
        .map(b => [Number(b[0]), Number(b[1])]);
}

const findClosestNextBus = (departure: number, busIds: number[]): [number, number] => {
    let busTimes: number[] = busIds.map(id => Math.ceil(departure/id)*id);
    let closestTime: number = Math.min(...busTimes);
    return [busIds[busTimes.indexOf(closestTime)], closestTime];
}

const calcPartOne = (input: string[]): number => {
    let departure: number = Number(input[0]);
    let result: [number, number] = findClosestNextBus(departure, parseActiveBuses(input[1]));
    return result[0] * (result[1]-departure);
}

const calcPartTwo = (input: string[]): number => {
    let busIds: number[][] = parseActiveBusesWithIndex(input[1]);
    let currBase: number = busIds[0][0];
    let currTime: number = currBase;

    for (let ids of busIds.slice(1)){
        while((currTime + ids[1]) % ids[0] != 0){
            currTime += currBase;
        }
        currBase = currBase * ids[0];
    }
    return currTime;
}

let input: string[] = readInputToStringArr("./day_13/input.txt");

console.log(calcPartOne(input));
console.log(calcPartTwo(input));