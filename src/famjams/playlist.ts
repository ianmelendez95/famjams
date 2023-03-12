import {fetchUserTracks} from "@/famjams/tracks";
import {fetchUserProfile} from "@/spotify/api";

export async function getUsernamesToTrackCount(accessToken: string, playlistId: string): Promise<Map<string, number>> {
    return new Map(await Promise.all([...(await fetchUserTracks(accessToken, playlistId)).entries()]
        .map(async ([userId, tracks]) => {
            const {display_name} = await fetchUserProfile(accessToken, userId)
            return ([display_name, tracks.length] as [string, number])
        })
    ))
}