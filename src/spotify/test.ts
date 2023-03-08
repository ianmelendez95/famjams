// import {getAccessToken, redirectToAuthCodeFlow} from "@/spotify/authCodeWithPkce";
// import {fetchUserTracks} from "@/famjams/tracks";

import {deObfuscate} from "@/famjams/obfuscate";
import {getAccessToken, redirectToAuthCodeFlow} from "@/spotify/authCodeWithPkce";
import {fetchUserTracks} from "@/famjams/tracks";
import {CLIENT_ID, PLAYLIST_ID} from "@/famjams/constants";

export async function test(password: string) {
    const clientId = await deObfuscate(password, CLIENT_ID)
    const playlistId = await deObfuscate(password, PLAYLIST_ID)

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
        await redirectToAuthCodeFlow(clientId);
    } else {
        const accessToken = await getAccessToken(clientId, code);
        await analyzePlaylist(accessToken, playlistId)
    }
}

async function analyzePlaylist(code: string, playlistId: string) {
    const userTracks: Map<string, Track[]> = await fetchUserTracks(code, playlistId)

    console.log("TRACKS: ", userTracks)
}