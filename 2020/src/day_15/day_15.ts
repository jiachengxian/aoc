const initializeMap = (input: number[]): Map<number, number> => {
    let map: Map<number, number> = new Map();
    input.map((num, i) => map.set(num, i+1));
    return map;
}

const takeTurn = (map: Map<number, number>, turn: number, lastNum: number): number => {
    let result: number | undefined = map.get(lastNum);

    if(result!=undefined){
        result = turn - result;
        map.set(lastNum, turn);
    } else {
        result = 0;
        map.set(lastNum, turn);
    }
    return result;
}

const runGame = (input: number[], totalTurns: number): number => {
    let map: Map<number, number> = initializeMap(input);

    //start game assuming all turns involving initial number set has passed
    let nextNum: number = 0;
    let turn: number = input.length + 1;

    while (turn < totalTurns){
        nextNum = takeTurn(map, turn, nextNum);
        turn ++;
    }
    return nextNum;
}

const input = [11,18,0,20,1,7,16];

console.log(runGame(input, 2020));
console.log(runGame(input, 30000000));
