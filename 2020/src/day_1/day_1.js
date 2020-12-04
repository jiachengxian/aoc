"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let getPairs = (arr) => arr.map((val, i) => arr.slice(i + 1).map((nextVal) => [val, nextVal])).flat();
let input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').split(/\r?\n/);
let pairs = getPairs(input);
let partOneAnswer = pairs.filter((pair) => Number(pair[0]) + Number(pair[1]) === 2020)[0];
console.log(Number(partOneAnswer[0]) * Number(partOneAnswer[1]));
for (var x = 0; x < input.length - 2; x++) {
    for (var y = x + 1; y < input.length - 1; y++) {
        for (var z = y + 1; z < input.length; z++) {
            if (Number(input[x]) + Number(input[y]) + Number(input[z]) == 2020) {
                console.log(Number(input[x]) * Number(input[y]) * Number(input[z]));
            }
        }
    }
}
