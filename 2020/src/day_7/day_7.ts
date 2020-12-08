import {readInputToStringArr} from '../input';

const parseRuleReverse = (input: string, map: Map<string, string[]>): void => {
    const ruleParts: string[] = input.split('contain')
        .map(part => part.trim());

    const left: string = ruleParts[0].replace('bags', '').replace('bag', '').trim();

    ruleParts[1].split(',')
        .map(right => right.replace('.', '').replace('bags', '').replace('bag', '').trim())
        .filter(right => right!= 'no other')
        .map(right => right.slice(2))
        .map(right => {
            let val: string[] = map.get(right) ?? [];
            val.push(left);
            map.set(right, val);
        });
}

const buildReverseMap = (input: string[]): Map<string, string[]> => {
    let map: Map<string, string[]> = new Map();
    input.map(line => parseRuleReverse(line, map));
    return map;
}

const getNumUniqueChildren = (root: string, map: Map<string, string[]>): number => {
    let childSet: Set<string> = new Set();
    addChildrenToSet(root, map, childSet);
    return childSet.size;
}

const addChildrenToSet = (parent: string, map: Map<string, string[]>, set: Set<string>): void => {
    if(!map.has(parent)){
        set.add(parent);
        return;
    }

    let children: string[] = map.get(parent) ?? [];
    for (let child of children){
        set.add(child);
        addChildrenToSet(child, map, set);
    }
}

const parseRule = (input: string, map: Map<string, string[]>) : void => {
    const ruleParts: string[] = input.split('contain')
        .map(part => part.trim());

    const left: string = ruleParts[0].replace('bags', '').replace('bag', '').trim();
    const right: string[] = ruleParts[1].split(',')
        .map(r => r.replace('.', '').replace('bags', '').replace('bag', '').trim())
        .filter(r => r!='no other');

    map.set(left, right);
}

const buildMap = (input: string[]): Map<string, string[]> => {
    let map: Map<string, string[]> = new Map();
    input.map(line => parseRule(line, map));
    return map;
}

const countTotalChildren = (parent: string, map: Map<string, string[]>): number => {
    let numChildren: number = 1;
    if(!map.has(parent)){
        return numChildren;
    }

    for (let child of map.get(parent)?? []){
        let count: number = Number(child.slice(0,1));
        let key: string = child.slice(2);

        numChildren = numChildren + count*countTotalChildren(key, map);
    }

    return numChildren;
}

const calcPartOne = (input: string[]): number => {
    let map: Map<string, string[]> = buildReverseMap(input);
    return getNumUniqueChildren('shiny gold', map);
}

const calcPartTwo = (input: string[]): number => {
    let map: Map<string, string[]> = buildMap(input);
    return countTotalChildren('shiny gold', map);
}

let input: string[] = readInputToStringArr("./day_7/input.txt");

console.log(calcPartOne(input));
console.log(calcPartTwo(input) - 1); //minus one for the original gold bag