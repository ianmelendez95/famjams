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
