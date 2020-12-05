import {readInputToStringArr} from '../input';

const treesEncountered = (xMov: number, yMov: number, input: string[]): number => {
    let currYPos: number = yMov;
    let currXPos: number = 0;
    let numTrees: number = 0;

    while(currYPos < input.length){
        let currLine: string = input[currYPos];

        currXPos = (currXPos + xMov) % currLine.length;
        if(currLine[currXPos]==='#') numTrees++;

        currYPos+= yMov;
    }

    return numTrees;
}

const calcPartTwo = (input: string[]): number => {
    return treesEncountered(1, 1, input)
        * treesEncountered(3, 1, input)
        * treesEncountered(5, 1, input)
        * treesEncountered(7, 1, input)
        * treesEncountered(1, 2, input); 
}

let input: string[] = readInputToStringArr("./day_3/input.txt");

console.log("Part one answer: " + treesEncountered(3, 1, input));

console.log("Part two answer: " + calcPartTwo(input));