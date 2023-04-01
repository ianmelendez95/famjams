import type {PlaylistTrack} from "@/spotify/types";
import {fetchAllItems} from "@/spotify/api";

export async function fetchUserTracks(accessToken: string, playlistId: string): Promise<Map<string, PlaylistTrack[]>> {
    const map: Map<string, PlaylistTrack[]> = new Map()

    const tracks: PlaylistTrack[] = await fetchAllItems<PlaylistTrack>(accessToken, `/playlists/${playlistId}/tracks`)

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

export function getTrackReleaseYear(track: PlaylistTrack): number {
    const pattern = /^(?<year>\d+)(-[-0-9]+)?$/
    const match = track.track.album.release_date.match(pattern) as RegExpMatchArray
    return parseInt(match.groups!.year)
}