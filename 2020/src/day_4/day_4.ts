import {readInputToStringArr} from '../input';

const countValidPassports = (input: string[]): number => {
    let currPassport: string = '';
    let count: number = 0;
    let i: number = 0;

    while(i < input.length){
        let currLine: string = input[i];
        if (currLine === ''){
            if (isValidPassport(currPassport)) {
                count++;   
            }
            currPassport = '';
        } else {
            currPassport = currPassport + currLine + ' ';
        }
        i++;
    }
    return count;
}

const passportAsMap = (input:string): Map<string,string> => {
    let passport = new Map<string, string>();

    input.split(' ')
        .map(field => field.split(':'))
        .map(fieldParts => passport.set(fieldParts[0], fieldParts[1]));

    return passport;
}

const isValidYear = (passport: Map<string,string>, field: string, floor: number, ceiling: number): boolean => {
    return passport.has(field) 
        && Number(passport.get(field)) >= floor 
        && Number(passport.get(field)) <= ceiling;
}

const isValidHgt = (passport: Map<string,string>): boolean => {
    let val: string | undefined = passport.get("hgt");
    if (val!=undefined){
        let units: string = val.slice(-2);
        let num: number = Number(val.slice(0, -2));
        if (units === 'in'){
            return num >= 59 && num <= 76;
        } else if (units === 'cm'){
            return num >= 150 && num <= 193;
        } 
    }
    return false;
}

const isValidHcl = (passport: Map<string,string>): boolean => {
    let val: string | undefined = passport.get("hcl");
    
    if (val!=undefined){
        return val.match(/^#[0-9a-f]{6}/) != null;
    }
    return false;
}

const isValidEcl = (passport: Map<string,string>): boolean => {
    const validEcl: string[] = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
    let val: string | undefined = passport.get("ecl");

    if (val!=undefined){
        return validEcl.includes(val); 
    }
    return false;
}

const isValidPid = (passport: Map<string,string>): boolean => {
    let val: string | undefined = passport.get("pid");

    if (val!=undefined){
        return val.match(/^[0-9]{9}/) != null && val.length===9;
    }
    return false;
}

const isValidPassport = (input: string): boolean => {
    let passport: Map<string,string> = passportAsMap(input);

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
}

let input: string[] = readInputToStringArr("./day_4/input.txt");

console.log("Answer: " + countValidPassports(input));