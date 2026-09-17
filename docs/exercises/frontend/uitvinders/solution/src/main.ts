import {inventors} from './data.js';
import type {Inventor} from './data.js';

export const sixteenthCentury: Inventor[] = inventors.filter((inventor: Inventor): boolean => inventor.year >= 1501 && inventor.year <= 1600);
export const birthYears: number[] = inventors.map((inventor: Inventor): number => inventor.year);
export const fullNames: string[] = inventors.map((inventor: Inventor): string => `${inventor.first} ${inventor.last}`);
export const byBirthYear: Inventor[] = [...inventors].sort((a: Inventor, b: Inventor): number => a.year - b.year);
export const byLifespan: Inventor[] = [...inventors].sort((a: Inventor, b: Inventor): number => (b.passed - b.year) - (a.passed - a.year));
export const edison: Inventor | undefined = inventors.find((inventor: Inventor): boolean => inventor.last === 'Edison');

console.log('16e eeuw:', sixteenthCentury);
console.log('Geboortejaren:', birthYears);
console.log('Volledige namen:', fullNames);
console.log('Op geboortejaar:', byBirthYear);
console.log('Op levensduur:', byLifespan);
console.log('Edison:', edison ?? 'Niet gevonden');
