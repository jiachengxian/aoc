import {readInputToStringArr} from '../input';
import {cartesianProduct} from '../utils';
import {cloneDeep} from 'lodash';

class Vec3{
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number){
        this.x = x, this.y = y, this.z = z;
    }

    toString = () => {
        return `[${this.x}, ${this.y}, ${this.z}]`;
    }
}

class Vec4{
    x: number;
    y: number;
    z: number;
    w: number;

    constructor(x: number, y: number, z: number, w: number){
        this.x = x, this.y = y, this.z = z, this.w = w;
    }

    toString = () => {
        return `[${this.x}, ${this.y}, ${this.z}, ${this.w}]`;
    }
}

const fromVec3String = (str: string): Vec3 => {
    let s: number[] = str.slice(1, str.length-1).split(',').map(s => Number(s));
    return new Vec3(s[0], s[1], s[2]);
}

const fromVec4String = (str: string): Vec4 => {
    let s: number[] = str.slice(1, str.length-1).split(',').map(s => Number(s));
    return new Vec4(s[0], s[1], s[2], s[3]);
}

const getAdjPoints3D = (pt: Vec3): Vec3[] => {
    let adj: Vec3[] = cartesianProduct([
        [pt.x - 1, pt.x, pt.x + 1], 
        [pt.y - 1, pt.y, pt.y + 1], 
        [pt.z - 1, pt.z, pt.z + 1]])
        .map(point => new Vec3(point[0], point[1], point[2]))
        .filter(vec => vec.x!=pt.x || vec.y != pt.y || vec.z != pt.z);
    return adj;
}

const getAdjPoints4D = (pt: Vec4): Vec4[] => {
    let adj: Vec4[] = cartesianProduct([
        [pt.x - 1, pt.x, pt.x + 1], 
        [pt.y - 1, pt.y, pt.y + 1], 
        [pt.z - 1, pt.z, pt.z + 1],
        [pt.w - 1, pt.w, pt.w + 1]])
        .map(pt => new Vec4(pt[0], pt[1], pt[2], pt[3]))
        .filter(vec => vec.x!=pt.x || vec.y != pt.y || vec.z != pt.z || vec.w != pt.w);
    return adj;
}

const parseInitialGraph = (input: string[]): Map<string, boolean> => {
    const w: number = 0;
    const z: number = 0;
    let map: Map<string, boolean> = new Map();
    input.map((line, y) => [...line].map((c, x) => {
        let isActive: boolean = c==='#' ? true : false;
        map.set(new Vec4(x,y,z,w).toString(), isActive);
    }))
    return map;
}

const iterateGraph = (currMap: Map<string, boolean>): Map<string, boolean> => {
    let newMap: Map<string, boolean> = cloneDeep(currMap);
    let exploredSet: Set<string> = new Set();

    //iterate through adjacent nodes of previous map's keys
    //mark explored nodes in explored set to avoid processing a node more than once
    //make updates to node-active-status map in new map so current iteration doesn't read from these changes
    [...currMap.keys()].map(point => getAdjPoints4D(fromVec4String(point)))
        .map(adjPoints => {
            for(let adjPt of adjPoints){
                let adjStr: string = adjPt.toString();
                if(exploredSet.has(adjStr)) continue;
                exploredSet.add(adjStr);
                newMap.set(adjStr, isCubeActive(adjPt, currMap));
            }
        });
    
    return newMap;
}

const isCubeActive = (pos: Vec4, map: Map<string, boolean>): boolean => {
    let numAdjActive:number = getAdjPoints4D(pos).filter(neighbor => map.get(neighbor.toString()) === true).length;
    if(map.get(pos.toString()) === true){
        return numAdjActive===2 || numAdjActive===3;
    }
    return numAdjActive===3;
}

const calcAnswer = (input: string[]): number => {
    let map: Map<string, boolean> = parseInitialGraph(input);
    for(let i = 0; i < 6; i++){
        map = iterateGraph(map);
    }
    let numActive: number = [...map.values()].filter(val => val===true).length;
    return numActive;
}

let input: string[] = readInputToStringArr("./day_17/input.txt");
console.log(calcAnswer(input));
