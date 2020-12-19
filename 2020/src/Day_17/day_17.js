"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("../input");
const utils_1 = require("../utils");
const lodash_1 = require("lodash");
class Vec3 {
    constructor(x, y, z) {
        this.toString = () => {
            return `[${this.x}, ${this.y}, ${this.z}]`;
        };
        this.x = x, this.y = y, this.z = z;
    }
}
class Vec4 {
    constructor(x, y, z, w) {
        this.toString = () => {
            return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
        };
        this.x = x, this.y = y, this.z = z, this.w = w;
    }
}
const fromVec3String = (str) => {
    let s = str.slice(1, str.length - 1).split(',').map(s => Number(s));
    return new Vec3(s[0], s[1], s[2]);
};
const fromVec4String = (str) => {
    let s = str.slice(1, str.length - 1).split(',').map(s => Number(s));
    return new Vec4(s[0], s[1], s[2], s[3]);
};
const getAdjPoints3D = (pt) => {
    let adj = utils_1.cartesianProduct([
        [pt.x - 1, pt.x, pt.x + 1],
        [pt.y - 1, pt.y, pt.y + 1],
        [pt.z - 1, pt.z, pt.z + 1]
    ])
        .map(point => new Vec3(point[0], point[1], point[2]))
        .filter(vec => vec.x != pt.x || vec.y != pt.y || vec.z != pt.z);
    return adj;
};
const getAdjPoints4D = (pt) => {
    let adj = utils_1.cartesianProduct([
        [pt.x - 1, pt.x, pt.x + 1],
        [pt.y - 1, pt.y, pt.y + 1],
        [pt.z - 1, pt.z, pt.z + 1],
        [pt.w - 1, pt.w, pt.w + 1]
    ])
        .map(pt => new Vec4(pt[0], pt[1], pt[2], pt[3]))
        .filter(vec => vec.x != pt.x || vec.y != pt.y || vec.z != pt.z || vec.w != pt.w);
    return adj;
};
const parseInitialGraph = (input) => {
    const w = 0;
    const z = 0;
    let map = new Map();
    input.map((line, y) => [...line].map((c, x) => {
        let isActive = c === '#' ? true : false;
        map.set(new Vec4(x, y, z, w).toString(), isActive);
    }));
    return map;
};
const iterateGraph = (currMap) => {
    let newMap = lodash_1.cloneDeep(currMap);
    let exploredSet = new Set();
    //iterate through adjacent nodes of previous map's keys
    //mark explored nodes in explored set to avoid processing a node more than once
    //make updates to node-active-status map in new map so current iteration doesn't read from these changes
    [...currMap.keys()].map(point => getAdjPoints4D(fromVec4String(point)))
        .map(adjPoints => {
        for (let adjPt of adjPoints) {
            let adjStr = adjPt.toString();
            if (exploredSet.has(adjStr))
                continue;
            exploredSet.add(adjStr);
            newMap.set(adjStr, isCubeActive(adjPt, currMap));
        }
    });
    return newMap;
};
const isCubeActive = (pos, map) => {
    let numAdjActive = getAdjPoints4D(pos).filter(neighbor => map.get(neighbor.toString()) === true).length;
    if (map.get(pos.toString()) === true) {
        return numAdjActive === 2 || numAdjActive === 3;
    }
    return numAdjActive === 3;
};
const calcAnswer = (input) => {
    let map = parseInitialGraph(input);
    for (let i = 0; i < 6; i++) {
        map = iterateGraph(map);
    }
    let numActive = [...map.values()].filter(val => val === true).length;
    return numActive;
};
let input = input_1.readInputToStringArr("./day_17/input.txt");
console.log(calcAnswer(input));
