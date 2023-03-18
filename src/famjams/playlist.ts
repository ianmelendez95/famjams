import {fetchUserTracks} from "@/famjams/tracks";
import {
    fetchAllCurrentUserPlaylists, fetchSpotify,
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

export async function getMultiContributorPlaylists(accessToken: string): Promise<UserPlaylist[]> {
    return await filterMultiContributorPlaylists(accessToken, await getCurrentUserPlaylists(accessToken))
}

export async function filterMultiContributorPlaylists(accessToken: string, playlists: UserPlaylist[]): Promise<UserPlaylist[]> {
    const assocMultiUser: [UserPlaylist, boolean][] = await Promise.all(
        playlists.map(p => isPlaylistMultiContributor(accessToken, p.id).then(r => [p, r] as [UserPlaylist, boolean]))
    )

    return assocMultiUser.filter(([_, isMultiUser]) => isMultiUser).map(([p, _]) => p)
}

export async function isPlaylistMultiContributor(accessToken: string, playlistId: string): Promise<boolean> {
    const result: { items: [{ added_by: { id: string } }] } =
        await fetchSpotify(accessToken, `/playlists/${playlistId}/tracks`, {
            fields: "items(added_by.id)"
        })

    return new Set(result.items.map(item => item.added_by.id)).size > 1
}