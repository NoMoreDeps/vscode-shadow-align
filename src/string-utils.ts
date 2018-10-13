export function extendToLength(value: string, length: number): string {
    return value + ' '.repeat(Math.max(0, length - value.length));
}