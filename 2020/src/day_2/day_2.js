"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const isValidPassword = (rule, pwd) => {
    var _a, _b;
    const ruleParts = parseRule(rule);
    const count = (_b = (_a = pwd.match(new RegExp(`${ruleParts[2]}`, "g"))) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    return count >= ruleParts[0] && count <= ruleParts[1];
};
const parseRule = (rule) => {
    const splitRule = rule.split(' ');
    const range = splitRule[0].split('-');
    const char = splitRule[1];
    return [Number(range[0]), Number(range[1]), char];
};
const calcPartOne = (input) => {
    return input.map((line) => line.split(":"))
        .filter((s) => s.length === 2)
        .filter((s) => isValidPassword(s[0].trim(), s[1].trim()))
        .length;
};
const xor = (a, b) => {
    return (!a && b) || (a && !b);
};
const isValidPassword2 = (rule, pwd) => {
    const ruleParts = parseRule(rule);
    //problem is one-indexed
    const loc1 = pwd[ruleParts[0] - 1];
    const loc2 = pwd[ruleParts[1] - 1];
    return xor(loc1 === ruleParts[2], loc2 === ruleParts[2]);
};
const calcPartTwo = (input) => {
    return input.map((line) => line.split(":"))
        .filter((s) => s.length === 2)
        .filter((s) => isValidPassword2(s[0].trim(), s[1].trim()))
        .length;
};
let input = input_1.readInputToStringArr("./day_2/input.txt");
console.log("Part one answer: " + calcPartOne(input));
console.log("Part two answer: " + calcPartTwo(input));
