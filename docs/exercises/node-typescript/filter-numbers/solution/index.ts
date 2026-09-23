interface FilterFunction {
    (number: number): boolean
}

function filter(numbers: number[], filterFunction: FilterFunction) {
    let filtered: number[] = [];
    for (let i = 0; i < numbers.length; i++) {
        if (filterFunction(numbers[i])) {
            filtered.push(numbers[i]);
        }
    }
    return filtered;
}

function filterPositive(numbers: number[]) {
    return filter(numbers, (number) => number > 0);
}

function filterNegative(numbers: number[]) {
    return filter(numbers, (number) => number < 0);
}

function filterEven(numbers: number[]) {
    return filter(numbers, (number) => number % 2 === 0);
}

const numbers: number[] = [-4,-4,1,2,3,4,5];
const isPositive = (number: number) => number >= 0;
console.log(filter(numbers, isPositive)); // 1,2,3,4,5

export {}
