export function extendToLength(value: string, length: number, alignSpec?:string): string {
    if (alignSpec) {
        const specs = alignSpec.split('|');
        if (specs.length > 1) {
            const direction = specs[1];
            switch(direction) {
                case "<-":
                    return value + ' '.repeat(Math.max(0, length - value.length));
                case "->":
                    return ' '.repeat(Math.max(0, length - value.length)) + value;
                case "--":
                    const needOne = Math.max(0, length - value.length) % 2 !== 0;
                    const half = (Math.max(0, length - value.length) / 2) >> 0;
                    return ' '.repeat(half) + value + ' '.repeat(half + (needOne ? 1 : 0));
            }
        }
        return value + ' '.repeat(Math.max(0, length - value.length));
    } else {
        return value + ' '.repeat(Math.max(0, length - value.length));
    }
}