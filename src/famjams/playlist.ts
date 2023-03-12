import {fetchUserTracks} from "@/famjams/tracks";
import {fetchUserProfile} from "@/spotify/api";
import type {UserProfile} from "@/spotify/types";

export async function getUsersToTrackCount(accessToken: string, playlistId: string): Promise<Map<UserProfile, number>> {
    return new Map(await Promise.all([...(await fetchUserTracks(accessToken, playlistId)).entries()]
        .map(async ([userId, tracks]) => {
            const profile = await fetchUserProfile(accessToken, userId)
            return ([profile, tracks.length] as [UserProfile, number])
        })
    ))
}