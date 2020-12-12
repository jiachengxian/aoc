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
exports.printInput = exports.mapFuncOnInputChunk = exports.readInputToStringArr = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const readInputToStringArr = (fileName) => fs.readFileSync(path.join(__dirname, fileName), 'utf8').split(/\r?\n/);
exports.readInputToStringArr = readInputToStringArr;
/**
 * Run provided function on each input chunk (separated by empty line)
 */
const mapFuncOnInputChunk = (input, mapFunc) => {
    let inputChunk = [];
    let result = [];
    let i = 0;
    while (i < input.length) {
        let currLine = input[i];
        if (currLine === '') {
            result.push(mapFunc(inputChunk));
            inputChunk = [];
        }
        else {
            inputChunk.push(currLine);
        }
        i++;
    }
    return result;
};
exports.mapFuncOnInputChunk = mapFuncOnInputChunk;
const printInput = (input) => {
    input.map(line => console.log(line));
};
exports.printInput = printInput;
