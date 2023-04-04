export function replaceDivBody(divEl: HTMLDivElement, body: Node) {
    clearDivBody(divEl)
    divEl.appendChild(body)
}

export function clearDivBody(divEl: HTMLDivElement) {
    for (const child of divEl.children) {
        divEl.removeChild(child)
    }
}

export function reverseSecond<S,T>(assoc: [S, T][]): [S, T][] {
    const end = assoc.length - 1
    return assoc.map(([k, _], i) => [k, assoc[end - i][1]])
}

export function reversed<S>(comp: (x: S, y: S) => number): (x: S, y: S) => number {
    return (x, y) => comp(y, x)
}

export function compareSecondBy<S>(compareFunction: (v1: S, v2: S) => number): ([_1, v1]: [unknown, S], [_2, v2]: [unknown, S]) => number {
    return ([_1, v1], [_2, v2]) => compareFunction(v1, v2)
}

export function compareNum(v1: number, v2: number): number {
    return v2 - v1
}

export function first<S>([x, _]: [S, unknown]): S {
    return x
}

export function second<S>([_, y]: [unknown, S]): S {
    return y
}

export function firstBy<S,T>(byFunction: (x: S) => T): ([x, _]: [S, unknown]) => T {
    return ([x, _]) => byFunction(x)
}

export function secondBy<S,T>(byFunction: (y: S) => T): ([_1, y]: [unknown, S]) => T {
    return ([_1, y]) => byFunction(y)
}

/**
 * Helper method for mapping over associative arrays.
 * 
 * [['a',1],['b',2]].map(applySecond(x => x * 100)) => [['a', 100],['b', 200]]
 */
export function applySecond<S,T>(func: (x: S) => T): ((p: [any, S]) => [any, T]) {
    return ([x1, x2]) => [x1, func(x2)]
}

export function averageBy<S>(array: S[], byFunction: (item: S) => number): number {
    return array.reduce((acc, x) => acc + byFunction(x), 0) / array.length
}

export function traverse<S,T>(mapFunction: (x: S) => T): (xs: S[]) => T[] {
    return xs => xs.map(mapFunction)
}

/**
 * NOTE: Uniqueness identified by 'SameValueZero' ECMA algorithm: https://tc39.es/ecma262/#sec-samevaluezero
 * @see https://tc39.es/ecma262/#sec-samevaluezero
 */
export function unique<S>(xs: S[]): S[] {
    return [...new Set(xs).values()]
}