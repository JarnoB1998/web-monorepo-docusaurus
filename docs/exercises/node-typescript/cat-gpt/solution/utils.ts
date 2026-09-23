function repeatWords(word: string, times: number, delimiter: string): string {
    return Array(times).fill(word).join(delimiter);
}

export { repeatWords };
