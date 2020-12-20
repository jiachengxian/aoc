import {readInputToStringArr} from '../input';

//returns [evaluated value, index]
const evaluateExpression = (input: string): [bigint, number] => {
    let total: bigint = BigInt(0);
    let op: string = '';
    let i: number = 0;
    while(i < input.length){
        let c:string = input[i];
        i++;
        
        if(c === ' ') continue;
        if(c === ')') return [total, i];
        if(c === '(') {
            let evalParenthesis: [bigint, number] = evaluateExpression(input.slice(i));
            let parenTotal: bigint = evalParenthesis[0];
            i += evalParenthesis[1];
            if(op === '*'){
                let lookAhead: [boolean, number] = additionLookahead(input.slice(i));
                if(lookAhead[0]){
                    let evalLookAhead: [bigint, number] = evaluateExpression(input.slice(i, i + lookAhead[1]));
                    parenTotal = parenTotal + evalLookAhead[0];
                    i += evalLookAhead[1];
                }
            }
            total = applyOp(op, total, parenTotal);
            continue;
        }
        if(c === '+' || c === '*'){
            op = c;
            continue;
        }
        if(!isNaN(Number(c))){
            if(op === '*'){
                let lookAhead: [boolean, number] = additionLookahead(input.slice(i));
                if(lookAhead[0]){
                    let result: [bigint, number] = applyLookahead(input, i, total, lookAhead[1]);
                    total = result[0];
                    i = result[1];
                    continue;
                }
            }
            total = applyOp(op, total, BigInt(c));
            continue;
        }
    }
    return [total, i];
}

const applyLookahead = (input: string, i: number, total: bigint, lookAheadEnd: number): [bigint, number] => {
    let result: [bigint, number] = [BigInt(0), 0];

    let evalLookahead: [bigint, number] = evaluateExpression(input.slice(i-1, i + lookAheadEnd));
    result[0] = applyOp('*', total, evalLookahead[0]);
    result[1] = evalLookahead[1] + i - 1;
    return result;
}

const additionLookahead = (input: string): [boolean, number] => {
    let hasAdditions: boolean = false;
    let i: number = 0;
    let numParens: number = 0;
    
    while (i < input.length){
        let c: string = input[i];
        if(c === '+'){
            hasAdditions = true;
        }
        if(c === '('){
            numParens++;
            while(numParens > 0){
                i++;
                if (input[i] === '(') numParens++;
                if (input[i] === ')') numParens--;
            }
        }
        if(c === ')' || c === '*'){
            return [hasAdditions, i];
        }
        i++;
    }
    return [hasAdditions, i];
}

const applyOp = (op: string, lh: bigint, rh: bigint): bigint => {
    switch(op){
        case '*':
            return BigInt(lh) * BigInt(rh);
        case '+':
            return BigInt(lh) + BigInt(rh);
        default:
            return rh;
    }
}

const calcAnswer = (input: string[]): bigint => {
    let sum: bigint = BigInt(0);
    input.forEach(line => sum+=evaluateExpression(line)[0]);
    return sum;
}

let input: string[] = readInputToStringArr("./day_18/input.txt");
console.log(calcAnswer(input));