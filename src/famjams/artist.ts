import type {Artist} from "@/spotify/types";
import {fetchSpotify} from "@/spotify/api";
import {unique} from "@/famjams/util";

export async function fetchArtistsByIds(accessToken: string, artistIds: string[]): Promise<Artist[]> {
    const res = await fetchSpotify<{ artists: Artist[] }>(accessToken, '/artists', {
        ids: unique(artistIds).join(',')
    })
    return res.artists
}
