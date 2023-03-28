import type {Playlist, UserPlaylist, UserPlaylists, UserProfile} from "@/spotify/types";

export const SPOTIFY_AUTH_ERROR = "SPOTIFY_AUTH_ERROR"

export interface Params {
  [key: string]: any
}

export interface UserPlaylistOptions {
  limit?: number,
  offset?: number
}

export function haveAccessToken(): boolean {
  return sessionStorage.getItem("accessToken") !== null
}

export function getAccessToken(): string {
  const token: string | null = sessionStorage.getItem("accessToken")
  if (token === null) {
    throw new Error(SPOTIFY_AUTH_ERROR + ": no auth token in session storage")
  }
  return token
}

export function setAccessToken(token: string) {
  sessionStorage.setItem("accessToken", token)
}

export function clearAccessToken() {
  sessionStorage.removeItem("accessToken")
}

export async function fetchAllCurrentUserPlaylists(accessToken: string): Promise<UserPlaylist[]> {
  const allPlaylists: UserPlaylist[] = []

  let response: UserPlaylists = await fetchCurrentUserPlaylists(accessToken, { limit: 50 })
  allPlaylists.push(...response.items)
  while (response.next != null) {
    response = await fetchSpotifyRaw(accessToken, response.next)
    allPlaylists.push(...response.items)
  }

  return allPlaylists
}

export async function fetchCurrentUserPlaylists(accessToken: string, options?: UserPlaylistOptions): Promise<UserPlaylists> {
  return await fetchSpotify(accessToken, "/me/playlists", options)
}

export async function fetchPlaylist(accessToken: string, playlistId: string): Promise<Playlist> {
  return await fetchSpotify(accessToken, "/playlists/" + playlistId)
}

export async function fetchUserProfile(accessToken: string, userId: string): Promise<UserProfile> {
  return await fetchSpotify(accessToken, "/users/" + userId)
}

export async function fetchSpotify<T>(accessToken: string, path: string, params?: Params): Promise<T> {
  const url = "https://api.spotify.com/v1"
      + (path.startsWith("/") ? path : '/' + path)
      + (params ? '?' + genUrlParams(params) : '')

  return fetchSpotifyRaw(accessToken, url)
}

async function fetchSpotifyRaw<T>(accessToken: string, url: string): Promise<T> {
  const result = await fetch(url, {
    method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
  });

  const json = await result.json();
  if (json.error) {
    if (json.error.status === 401) {
      throw new Error(SPOTIFY_AUTH_ERROR + ": " + JSON.stringify(json.error))
    } else if (json.error.status === 429) {
      console.warn("Rate limit exceeded, retrying in " + result.headers.get("retry-after") + " seconds")
      const retryAfterSeconds: number = parseInt(result.headers.get("retry-after") as string)
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("TRACE: retrying now")
          resolve(fetchSpotifyRaw(accessToken, url))
        }, retryAfterSeconds * 1000)
      })
    } else {
      throw new Error("Server error: " + JSON.stringify(json.error))
    }
  }

  return json
}

function genUrlParams(params: Params): string {
  const builder = new URLSearchParams()

  for (const param in params) {
    builder.append(param, params[param].toString())
  }

  return builder.toString()
}