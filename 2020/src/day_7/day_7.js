"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const parseRuleReverse = (input, map) => {
    const ruleParts = input.split('contain')
        .map(part => part.trim());
    const left = ruleParts[0].replace('bags', '').replace('bag', '').trim();
    ruleParts[1].split(',')
        .map(right => right.replace('.', '').replace('bags', '').replace('bag', '').trim())
        .filter(right => right != 'no other')
        .map(right => right.slice(2))
        .map(right => {
        var _a;
        let val = (_a = map.get(right)) !== null && _a !== void 0 ? _a : [];
        val.push(left);
        map.set(right, val);
    });
};
const buildReverseMap = (input) => {
    let map = new Map();
    input.map(line => parseRuleReverse(line, map));
    return map;
};
const getNumUniqueChildren = (root, map) => {
    let childSet = new Set();
    addChildrenToSet(root, map, childSet);
    return childSet.size;
};
const addChildrenToSet = (parent, map, set) => {
    var _a;
    if (!map.has(parent)) {
        set.add(parent);
        return;
    }
    let children = (_a = map.get(parent)) !== null && _a !== void 0 ? _a : [];
    for (let child of children) {
        set.add(child);
        addChildrenToSet(child, map, set);
    }
};
const parseRule = (input, map) => {
    const ruleParts = input.split('contain')
        .map(part => part.trim());
    const left = ruleParts[0].replace('bags', '').replace('bag', '').trim();
    const right = ruleParts[1].split(',')
        .map(r => r.replace('.', '').replace('bags', '').replace('bag', '').trim())
        .filter(r => r != 'no other');
    map.set(left, right);
};
const buildMap = (input) => {
    let map = new Map();
    input.map(line => parseRule(line, map));
    return map;
};
const countTotalChildren = (parent, map) => {
    var _a;
    let numChildren = 1;
    if (!map.has(parent)) {
        return numChildren;
    }
    for (let child of (_a = map.get(parent)) !== null && _a !== void 0 ? _a : []) {
        let count = Number(child.slice(0, 1));
        let key = child.slice(2);
        numChildren = numChildren + count * countTotalChildren(key, map);
    }
    return numChildren;
};
const calcPartOne = (input) => {
    let map = buildReverseMap(input);
    return getNumUniqueChildren('shiny gold', map);
};
const calcPartTwo = (input) => {
    let map = buildMap(input);
    return countTotalChildren('shiny gold', map);
};
let input = input_1.readInputToStringArr("./day_7/input.txt");
console.log(calcPartOne(input));
console.log(calcPartTwo(input) - 1); //minus one for the original gold bag
