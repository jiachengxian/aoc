"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
//returns [evaluated value, index]
const evaluateExpression = (input) => {
    let total = BigInt(0);
    let op = '';
    let i = 0;
    while (i < input.length) {
        let c = input[i];
        i++;
        if (c === ' ')
            continue;
        if (c === ')')
            return [total, i];
        if (c === '(') {
            let evalParenthesis = evaluateExpression(input.slice(i));
            let parenTotal = evalParenthesis[0];
            i += evalParenthesis[1];
            if (op === '*') {
                let lookAhead = additionLookahead(input.slice(i));
                if (lookAhead[0]) {
                    let evalLookAhead = evaluateExpression(input.slice(i, i + lookAhead[1]));
                    parenTotal = parenTotal + evalLookAhead[0];
                    i += evalLookAhead[1];
                }
            }
            total = applyOp(op, total, parenTotal);
            continue;
        }
        if (c === '+' || c === '*') {
            op = c;
            continue;
        }
        if (!isNaN(Number(c))) {
            if (op === '*') {
                let lookAhead = additionLookahead(input.slice(i));
                if (lookAhead[0]) {
                    let result = applyLookahead(input, i, total, lookAhead[1]);
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
};
const applyLookahead = (input, i, total, lookAheadEnd) => {
    let result = [BigInt(0), 0];
    let evalLookahead = evaluateExpression(input.slice(i - 1, i + lookAheadEnd));
    result[0] = applyOp('*', total, evalLookahead[0]);
    result[1] = evalLookahead[1] + i - 1;
    return result;
};
const additionLookahead = (input) => {
    let hasAdditions = false;
    let i = 0;
    let numParens = 0;
    while (i < input.length) {
        let c = input[i];
        if (c === '+') {
            hasAdditions = true;
        }
        if (c === '(') {
            numParens++;
            while (numParens > 0) {
                i++;
                if (input[i] === '(')
                    numParens++;
                if (input[i] === ')')
                    numParens--;
            }
        }
        if (c === ')' || c === '*') {
            return [hasAdditions, i];
        }
        i++;
    }
    return [hasAdditions, i];
};
const applyOp = (op, lh, rh) => {
    switch (op) {
        case '*':
            return BigInt(lh) * BigInt(rh);
        case '+':
            return BigInt(lh) + BigInt(rh);
        default:
            return rh;
    }
};
const calcAnswer = (input) => {
    let sum = BigInt(0);
    input.forEach(line => sum += evaluateExpression(line)[0]);
    return sum;
};
let input = input_1.readInputToStringArr("./day_18/input.txt");
console.log(calcAnswer(input));
