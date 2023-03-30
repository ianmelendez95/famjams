export function replaceDivBody(divEl: HTMLDivElement, body: Node) {
    clearDivBody(divEl)
    divEl.appendChild(body)
}

export function clearDivBody(divEl: HTMLDivElement) {
    for (const child of divEl.children) {
        divEl.removeChild(child)
    }
}

export function reversed<S>(comp: (x: S, y: S) => number): (x: S, y: S) => number {
    return (x, y) => comp(y, x)
}

/**
 * Helper method for comparing associative arrays.
 * 
 * [['a',2],['b',1]].sort(compareSecondNum) => [['b', 1],['a', 2]]
 */
export function compareSecondNum([_1, v1]: [any, number], [_2, v2]: [any, number]): number {
    return v2 - v1
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
