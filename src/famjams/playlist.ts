import {fetchUserTracks} from "@/famjams/tracks";
import {
    fetchAllItems, fetchSpotify,
} from "@/spotify/api";
import type {PlaylistTrack, Playlist, UserProfile} from "@/spotify/types";

export async function getUsersToTracks(accessToken: string, playlistId: string): Promise<Map<UserProfile, PlaylistTrack[]>> {
    return new Map(await Promise.all([...(await fetchUserTracks(accessToken, playlistId)).entries()]
        .map(async ([userId, tracks]) => {
            const profile = await fetchSpotify(accessToken, "/users/" + userId)
            return ([profile, tracks] as [UserProfile, PlaylistTrack[]])
        })
    ))
}

export async function getMultiContributorPlaylists(accessToken: string): Promise<Playlist[]> {
    const playlists: Playlist[] = await fetchAllItems(accessToken, '/me/playlists')
    
    // filter by whether they have multiple contributors
    // in parallel with Promise.all 
    // TODO - if done sequentially could avoid rate limiting,
    //        but would need to be done via UI list that populates 
    //        as they resolve instead of waiting for all to finish
    const assocMultiUser: [Playlist, boolean][] = await Promise.all(
        playlists.map(p => isPlaylistMultiContributor(accessToken, p.id).then(r => [p, r] as [Playlist, boolean]))
    )

    return assocMultiUser.filter(([_, isMultiUser]) => isMultiUser).map(([p, _]) => p)
}

export async function isPlaylistMultiContributor(accessToken: string, playlistId: string): Promise<boolean> {
    // TODO - this could avoid looping through all by breaking early 
    //        (though may not be relevant if most playlists are not multi contributor,
    //        session cache may be more effective)
    const result = await fetchAllItems<{ added_by: { id: string } }>(
        accessToken,
        `/playlists/${playlistId}/tracks`, {
            fields: "items(added_by.id)"
        }
    )

    return new Set(
        result.filter(item => item.added_by.id).map(item => item.added_by.id)
    ).size > 1
}