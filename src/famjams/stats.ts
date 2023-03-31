import {applySecond} from "@/famjams/util";

/**
 * @param stats the list of stats to show. 
 *              Practically 'any' type because we don't care for the contents, 
 *              just the number of rows.
 */
export function trimLeaderboard<T>(stats: T[]): T[] {
    if (window.matchMedia('(min-width: 768px)').matches) {
        return stats
    } else {
        return stats.slice(0, 3)
    }
}

/**
 * Simulates a similar effect to when bar graphs compare data, but the 
 * starting y value is far more than zero,
 * in order to give the illusion that the differences between values is 
 * much greater than it actually is.
 * 
 * Technically, this subtracts the 'new minimum' from each value.
 * The 'new minimum' is obtained by subtracting 1/4 the range (max - min) 
 * from the current minimum value.
 */
export function relativizeToMinimum<T>(stats: [T, number][]): [T, number][] {
    const [min, max] = stats.reduce(
        ([curMin, curMax], [_, x]) => [Math.min(curMin, x), Math.max(curMax, x)], 
        [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    )
    
    const newMin = Math.floor(min - (0.25 * (max - min)))
    
    return stats.map(applySecond(v => v - newMin))
}
