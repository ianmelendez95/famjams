import {getAccessToken, redirectToAuthCodeFlow} from "@/spotify/authCodeWithPkce";
import {fetchUserTracks} from "@/famjams/tracks";

export async function test(password: string) {
    console.log("Got password: " + password)

    // const params = new URLSearchParams(window.location.search);
    // const code = params.get("code");
    //
    // if (!code) {
    //     await redirectToAuthCodeFlow(CLIENT_ID);
    // } else {
    //     const accessToken = await getAccessToken(CLIENT_ID, code);
    //     await analyzePlaylist(accessToken)
    // }
}

async function analyzePlaylist(code: string) {
    const userTracks: Map<string, Track[]> = await fetchUserTracks(code)

    console.log(userTracks)
}