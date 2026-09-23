export function validateAge(age: number): void {
    if (age <= 0 || age > 150) {
        throw new Error('Age must be between 1 and 150');
    }
}

export function validateUsername(username: string): void {
    if (username.length < 3 || username.length > 20) {
        throw new Error('Username must contain between 3 and 20 characters');
    }
}
