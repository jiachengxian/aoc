import * as fs from 'fs';
import * as path from 'path';

let getPairs = (arr: string[]): string[][] => arr.map(
    (val: string, i: number) => arr.slice(i+1).map((nextVal:string) => [val,nextVal])).flat();

let input: string[] = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split(/\r?\n/);

let pairs: string[][] = getPairs(input);

let partOneAnswer: string[] = pairs.filter((pair)=> Number(pair[0]) + Number(pair[1])===2020)[0];
console.log("Part one answer: " + Number(partOneAnswer[0])*Number(partOneAnswer[1]));

//TODO - clean this up using O(n^2) implementation
for (var x = 0; x < input.length-2; x++){
    for (var y = x+1; y < input.length-1; y++){
        for (var z = y+1; z < input.length; z++){
            if(Number(input[x]) + Number(input[y]) + Number(input[z]) == 2020 ){
                console.log(Number(input[x]) * Number(input[y]) * Number(input[z]));
            }
        }
    }
}
