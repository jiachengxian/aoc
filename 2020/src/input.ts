import * as fs from 'fs';
import * as path from 'path';

export const readInputToStringArr = (fileName: string): string[] =>
        fs.readFileSync(path.join(__dirname, fileName), 'utf8').split(/\r?\n/);

/**
 * Run provided function on each input chunk (separated by empty line)
 */
export const mapFuncOnInputChunk = (input: string[], mapFunc: Function): any[] => {
	let inputChunk: string[] = [];
	let result: any[] = [];
	let i: number = 0;

	while(i < input.length){
		let currLine: string = input[i];
		if (currLine === ''){
			result.push(mapFunc(inputChunk));
			inputChunk = [];
		} else {
			inputChunk.push(currLine);
		}
		i++;
	}
	return result;
}