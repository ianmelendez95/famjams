import type {Track} from "@/spotify/types";
import {fetchAllItems, fetchSpotify} from "@/spotify/api";

export async function fetchUserTracks(accessToken: string, playlistId: string): Promise<Map<string, Track[]>> {
    const map: Map<string, Track[]> = new Map()

    const tracks: Track[] = await fetchAllItems<Track>(
        accessToken,
        fetchSpotify(accessToken, `/playlists/${playlistId}/tracks`, {
            limit: 50
        })
    )

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