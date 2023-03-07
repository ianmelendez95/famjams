// import {getAccessToken, redirectToAuthCodeFlow} from "@/spotify/authCodeWithPkce";
// import {fetchUserTracks} from "@/famjams/tracks";

import {deObfuscate} from "@/famjams/obfuscate";
import {getAccessToken, redirectToAuthCodeFlow} from "@/spotify/authCodeWithPkce";
import {fetchUserTracks} from "@/famjams/tracks";

const CLIENT_ID = "dc493626472bdcab3e5b3ba3ec4622bb2a45fa70c36f1d0c44fba99397e5042141f2b74e7864750f13f93cbec298a280"
const PLAYLIST_ID = "d92b4078376486e8652158f2973b589c0a22f85390008c17108e36cc87f5a6d0b650d0aa2dc7"

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