import {applySecond} from "@/famjams/util";
import type {PlaylistTrack, PlaylistTrackArtist} from "@/spotify/types";
import {max} from "d3";

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

export function countMaxArtistTrackCount(tracks: PlaylistTrack[]): [PlaylistTrackArtist, number] {
    const artistsById = new Map()
    const countsById = new Map()
    for (const t of tracks) {
        for (const a of t.track.artists) {
            artistsById.set(a.id, a)
            if (countsById.has(a.id)) {
                countsById.set(a.id, countsById.get(a.id) + 1)
            } else {
                countsById.set(a.id, 1)
            }
        }
    }
    
    let maxId = null
    let maxCount = Number.MIN_SAFE_INTEGER
    for (const [id, count] of countsById.entries()) {
        if (count > maxCount) {
            maxId = id
            maxCount = count
        }
    }
    return [artistsById.get(maxId), maxCount]
}