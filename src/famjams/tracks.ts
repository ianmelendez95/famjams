import type {Track} from "@/spotify/types";
import {fetchAllItems} from "@/spotify/api";

export async function fetchUserTracks(accessToken: string, playlistId: string): Promise<Map<string, Track[]>> {
    const map: Map<string, Track[]> = new Map()

    const tracks: Track[] = await fetchAllItems<Track>(accessToken, `/playlists/${playlistId}/tracks`)

    // associate the users to the songs they added to the playlist
    for (const track of tracks) {
        let userTracks = map.get(track.added_by.id)
        if (!userTracks) {
            userTracks = []
            map.set(track.added_by.id, userTracks)
        }
        userTracks.push(track)
    }

    return map
}

export function getTrackReleaseYear(track: Track): number {
    const pattern = /^(?<year>\d+)(-[-0-9]+)?$/
    const match = track.track.album.release_date.match(pattern) as RegExpMatchArray
    return parseInt(match.groups!.year)
}