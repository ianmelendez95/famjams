import type {PlaylistTrack, PlaylistTrackArtist, UserProfile} from "@/spotify/types";
import {fetchArtistsByIds} from "@/famjams/artist";
import type {DonutChartData} from "@/components/observable/donut";

/**
 * Structure compatible with DonutChartData, 
 * with  extra fields usable by PlaylistStatTemplate.
 */
export interface UserValue extends DonutChartData {
    user: UserProfile,
    value: number,
    
    displayValue?: string,
    image?: string,
    miscText?: string
}

export function userValueComparator(v1: UserValue, v2: UserValue): number {
    return v2.value - v1.value
}

export function onLargeScreen() {
    return window.matchMedia('(min-width: 768px)').matches
}

/**
 * @param stats the list of stats to show. 
 *              Practically 'any' type because we don't care for the contents, 
 *              just the number of rows.
 */
export function trimLeaderboard<T>(stats: T[]): T[] {
    if (onLargeScreen()) {
        return stats
    } else {
        return stats.slice(0, 3)
    }
}

/**
 * Preserves initial value as UserValue.displayValue, if not already provided.
 * 
 * Simulates a similar effect to when bar graphs compare data, but the 
 * starting y value is far more than zero,
 * in order to give the illusion that the differences between values is 
 * much greater than it actually is.
 * 
 * Technically, this subtracts the 'new minimum' from each value.
 * The 'new minimum' is obtained by subtracting 1/4 the range (max - min) 
 * from the current minimum value.
 */
export function relativizeToMinimum(stats: UserValue[]): UserValue[] {
    const [min, max] = stats.reduce(
        ([curMin, curMax], { value }) => [Math.min(curMin, value), Math.max(curMax, value)], 
        [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
    )
    
    const newMin = Math.floor(min - (0.25 * (max - min)))
    
    return stats.map(v => {
        return Object.assign({
            // preserve original value in displayValue if not already set
            displayValue: v.value.toString()
        }, v, {
            value: v.value - newMin
        })
    })
}

/**
 * Reverse the values among the stats.
 * 
 * This is useful when a lower number is to be displayed as a larger 'portion' of the graph.
 * i.e. 'less is more' statistically.
 */
export function reverseValues(stats: UserValue[]): UserValue[] {
    const end = stats.length - 1
    return stats.map((value, i) => {
        return Object.assign({
            // preserve original value in displayValue if not already set
            displayValue: value.value.toString()
        }, value, { 
            value: stats[end - i].value 
        })
    })
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

export async function getUserTrackArtistMaxCounts(accessToken: string, userTracks: Map<UserProfile, PlaylistTrack[]>): Promise<UserValue[]> {
    const initialUserTrackArtists: [UserValue, PlaylistTrackArtist][] = [...userTracks.entries()]
        .map(([user, tracks]) => {
            const [artist, count] = countMaxArtistTrackCount(tracks)
            return [{ user, value: count }, artist]
        })

    // associate each user's count with the artist image for the leaderboard
    return (await resolveArtistCountImages(accessToken, initialUserTrackArtists))
        .sort(userValueComparator)
}

/**
 * Adds artist image and name to the given UserValues according to the matching
 * PlaylistTrackArtist.
 * 
 * The artist information included in playlist track information does not contain
 * artist images, so we need to query the artist information from the API, thus
 * this needs to be an async function.
 */
export async function resolveArtistCountImages(accessToken: string, stats: [UserValue, PlaylistTrackArtist][]): Promise<UserValue[]> {
    const artists = await fetchArtistsByIds(accessToken, stats.map(([_, a]) => a.id))
    const imagesById = new Map(artists.map(a => [a.id, a.images[0].url]))

    return stats.map(([value, artist]) =>
        Object.assign({}, value, {
            image: imagesById.get(artist.id),
            miscText: artist.name
        })
    )
}