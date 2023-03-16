import {fetchUserTracks} from "@/famjams/tracks";
import {
    fetchAllCurrentUserPlaylists,
    fetchUserProfile
} from "@/spotify/api";
import type {Track, UserPlaylist, UserProfile} from "@/spotify/types";

export async function getCurrentUserPlaylists(accessToken: string): Promise<UserPlaylist[]> {
    return await fetchAllCurrentUserPlaylists(accessToken)
}

export async function getUsersToTracks(accessToken: string, playlistId: string): Promise<Map<UserProfile, Track[]>> {
    return new Map(await Promise.all([...(await fetchUserTracks(accessToken, playlistId)).entries()]
        .map(async ([userId, tracks]) => {
            const profile = await fetchUserProfile(accessToken, userId)
            return ([profile, tracks] as [UserProfile, Track[]])
        })
    ))
}