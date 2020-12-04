import * as fs from 'fs';
import * as path from 'path';

export const readInputToStringArr = (fileName: string): string[] =>
        fs.readFileSync(path.join(__dirname, fileName), 'utf8').split(/\r?\n/);