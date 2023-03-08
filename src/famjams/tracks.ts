import {fetchPlaylist} from "@/spotify/api";

export async function fetchUserTracks(accessToken: string, playlistId: string): Promise<Map<string, Track[]>> {
    const map: Map<string, Track[]> = new Map()

    const playlist: Playlist = await fetchPlaylist(accessToken, playlistId)

    // associate the users to the songs they added to the playlist
    for (const track of playlist.tracks.items) {
        let userTracks = map.get(track.added_by.id)
        if (!userTracks) {
            userTracks = []
            map.set(track.added_by.id, userTracks)
        }
        userTracks.push(track)
    }

    return map
}