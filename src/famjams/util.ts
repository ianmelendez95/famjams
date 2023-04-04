
export function reversed<S>(comp: (x: S, y: S) => number): (x: S, y: S) => number {
    return (x, y) => comp(y, x)
}

export function averageBy<S>(array: S[], byFunction: (item: S) => number): number {
    return array.reduce((acc, x) => acc + byFunction(x), 0) / array.length
}

/**
 * NOTE: Uniqueness identified by 'SameValueZero' ECMA algorithm: https://tc39.es/ecma262/#sec-samevaluezero
 * @see https://tc39.es/ecma262/#sec-samevaluezero
 */
export function unique<S>(xs: S[]): S[] {
    return [...new Set(xs).values()]
}