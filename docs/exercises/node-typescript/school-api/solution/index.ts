import readline from 'readline-sync';

interface School {
    web_pages: string[];
    country: string;
    domains: string[];
    name: string;
    alpha_two_code: string;
    state_province: string | null;
}

// [1] France 
// [2] Netherlands 
// [3] United Kingdom 
// [4] Belgium 
// [5] luxembourg 
// [6] Ireland 
// [7] Spain 
// [8] Portugal 
// [0] CANCEL

// Which country would you like to list its Colleges with high school education degrees? [1...8 / 0]: 5
// Colleges in luxembourg: 
// International University 
// Institute of Luxembourg 
// University of Luxemburg 
// International University 
// Institute of Luxembourg 
// University of Luxemburg

const countries: string[] = [
    'France',
    'Netherlands',
    'United Kingdom',
    'Belgium',
    'luxembourg',
    'Ireland',
    'Spain',
    'Portugal'
];

async function readSchools(country: string) {
    const response = await fetch(`http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`);
    const schools: School[] = await response.json();

    console.log(`Colleges in ${country}:`);
    for (const school of schools) {
        console.log(school.name);
    }
}

async function main() {

    let running: boolean = true;
    do {
        let countryIndex: number = readline.keyInSelect(countries, 'Which country would you like to list its Colleges with high school education degrees?');
        if (countryIndex === -1) {
            running = false;
            break;
        } else {
            let country: string = countries[countryIndex];
            await readSchools(country);
            running = readline.keyInYNStrict('Do you want to look up another country?');
        }
    } while (running);
}
main();

export {}
