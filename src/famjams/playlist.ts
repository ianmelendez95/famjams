import {fetchUserTracks} from "@/famjams/tracks";
import {fetchUserProfile} from "@/spotify/api";
import type {Track, UserProfile} from "@/spotify/types";

export async function getUsersToTracks(accessToken: string, playlistId: string): Promise<Map<UserProfile, Track[]>> {
    return new Map(await Promise.all([...(await fetchUserTracks(accessToken, playlistId)).entries()]
        .map(async ([userId, tracks]) => {
            const profile = await fetchUserProfile(accessToken, userId)
            return ([profile, tracks] as [UserProfile, Track[]])
        })
    ))
}