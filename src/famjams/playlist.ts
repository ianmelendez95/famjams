import {fetchUserTracks} from "@/famjams/tracks";
import {fetchUserProfile} from "@/spotify/api";

export async function getUsernamesToTrackCount(accessToken: string, playlistId: string): Promise<Map<string, number>> {
    const userTracks: Map<string, Track[]> = await fetchUserTracks(accessToken, playlistId)

    const usernameCounts = new Map<string, number>()
    for (const [userId, tracks] of userTracks) {
        const username = (await fetchUserProfile(accessToken, userId)).display_name

        usernameCounts.set(username, tracks.length)
    }

    return usernameCounts
}