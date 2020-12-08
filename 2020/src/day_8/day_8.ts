import {readInputToStringArr} from '../input';
import {cloneDeep} from 'lodash';

const isLoop = (input: string[]): [boolean, number] => {
    let acc: number = 0;
    let pos: number = 0;
    let visited: Set<number> = new Set();

    while(!visited.has(pos)){
        if(pos >= input.length){
            return [false, acc];
        }
        visited.add(pos);

        let currLine: string[] = input[pos].split(' ');
        switch(currLine[0]){
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
}

const fixInput = (input: string[]): number => {
    let inputIsLooping: boolean = true;
    let pos: number = 0;
    let acc: number = 0;

    while (inputIsLooping){
        let inputCpy: string[] = cloneDeep(input);
        let currLine: string = inputCpy[pos];

        if (currLine.startsWith('nop')){
            inputCpy[pos] = currLine.replace('nop', 'jmp');
        }
        else if (currLine.startsWith('jmp')){
            inputCpy[pos] = currLine.replace('jmp', 'nop');
        }

        let result: [boolean, number] = isLoop(inputCpy);
        inputIsLooping = result[0];
        acc = result[1];
        pos++;
    }
    return acc;
}

let input: string[] = readInputToStringArr("./day_8/input.txt");

console.log(isLoop(input));
console.log(fixInput(input));
