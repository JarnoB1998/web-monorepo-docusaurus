

import { type RgbColor, rainbow } from "rainbow-colors-array-ts";
import chalk from 'chalk';


let rows : number = process.stdout.rows;
let columns : number = process.stdout.columns;

const colors : RgbColor[] = rainbow(rows, "rgb");
for (let color of colors) {
    console.log(chalk.bgRgb(color.r, color.g, color.b)(" ".repeat(columns)));
}

export {}