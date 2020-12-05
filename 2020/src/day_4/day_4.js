"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const countValidPassports = (input) => {
    let currPassport = '';
    let count = 0;
    let i = 0;
    while (i < input.length) {
        let currLine = input[i];
        if (currLine === '') {
            if (isValidPassport(currPassport)) {
                count++;
            }
            currPassport = '';
        }
        else {
            currPassport = currPassport + currLine + ' ';
        }
        i++;
    }
    return count;
};
const passportAsMap = (input) => {
    let passport = new Map();
    input.split(' ')
        .map(field => field.split(':'))
        .map(fieldParts => passport.set(fieldParts[0], fieldParts[1]));
    return passport;
};
const isValidYear = (passport, field, floor, ceiling) => {
    return passport.has(field)
        && Number(passport.get(field)) >= floor
        && Number(passport.get(field)) <= ceiling;
};
const isValidHgt = (passport) => {
    let val = passport.get("hgt");
    if (val != undefined) {
        let units = val.slice(-2);
        let num = Number(val.slice(0, -2));
        if (units === 'in') {
            return num >= 59 && num <= 76;
        }
        else if (units === 'cm') {
            return num >= 150 && num <= 193;
        }
    }
    return false;
};
const isValidHcl = (passport) => {
    let val = passport.get("hcl");
    if (val != undefined) {
        return val.match(/^#[0-9a-f]{6}/) != null;
    }
    return false;
};
const isValidEcl = (passport) => {
    const validEcl = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
    let val = passport.get("ecl");
    if (val != undefined) {
        return validEcl.includes(val);
    }
    return false;
};
const isValidPid = (passport) => {
    let val = passport.get("pid");
    if (val != undefined) {
        return val.match(/^[0-9]{9}/) != null && val.length === 9;
    }
    return false;
};
const isValidPassport = (input) => {
    let passport = passportAsMap(input);
    //Part one
    /*
    return passport.has("byr")
        && passport.has("iyr")
        && passport.has("eyr")
        && passport.has("hgt")
        && passport.has("hcl")
        && passport.has("ecl")
        && passport.has("pid");
    */
    //part two
    return isValidYear(passport, "byr", 1920, 2002)
        && isValidYear(passport, "iyr", 2010, 2020)
        && isValidYear(passport, "eyr", 2020, 2030)
        && isValidHgt(passport)
        && isValidHcl(passport)
        && isValidEcl(passport)
        && isValidPid(passport);
};
let input = input_1.readInputToStringArr("./day_4/input.txt");
console.log("Answer: " + countValidPassports(input));
