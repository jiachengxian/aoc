import {readInputToStringArr} from '../input';

const isValidPassword = (rule: string, pwd: string): boolean => {
    const ruleParts: [number, number, string] = parseRule(rule);
    const count: number = pwd.match(new RegExp(`${ruleParts[2]}`, "g"))?.length ?? 0;

    return count >= ruleParts[0] && count <= ruleParts[1];
}

const parseRule = (rule: string): [number, number, string] => {
    const splitRule: string[] = rule.split(' ');
    const range: string[] = splitRule[0].split('-');
    const char: string = splitRule[1];

    return [Number(range[0]), Number(range[1]), char];
}

const calcPartOne = (input: string[]): number => {
    return input.map((line: string) => line.split(":"))
        .filter((s: string[]) => s.length === 2)
        .filter((s: string[]) => isValidPassword(s[0].trim(), s[1].trim()))
        .length;
}

const xor = (a: boolean, b: boolean): boolean => {
    return (!a && b) || (a && !b);
}

const isValidPassword2 = (rule: string, pwd: string): boolean => {
    const ruleParts: [number, number, string] = parseRule(rule);
    //problem is one-indexed
    const loc1: string = pwd[ruleParts[0]-1];
    const loc2: string = pwd[ruleParts[1]-1];
    return xor(loc1===ruleParts[2], loc2===ruleParts[2]);
}

const calcPartTwo = (input: string[]): number => {
    return input.map((line: string) => line.split(":"))
        .filter((s: string[]) => s.length === 2)
        .filter((s: string[]) => isValidPassword2(s[0].trim(), s[1].trim()))
        .length;
}

let input: string[] = readInputToStringArr("./day_2/input.txt");

console.log("Part one answer: " + calcPartOne(input));
console.log("Part two answer: " + calcPartTwo(input));