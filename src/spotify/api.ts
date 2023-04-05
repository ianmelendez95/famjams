import type {ItemsResponse} from "@/spotify/types";

export const SPOTIFY_AUTH_ERROR = "SPOTIFY_AUTH_ERROR"
export const SPOTIFY_BETA_ERROR = "SPOTIFY_BETA_ERROR"

export interface Params {
  [key: string]: any
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

/**
 * Given a URL that returns an ItemsResponse<T>, resolves all relevant
 * items of that collection.
 * <p>
 * <b>[The Spotify 'Items' APIs]</b>
 * <p>
 * The Spotify API has a pattern for querying a collection of items.
 * <p>
 * Each API call returns an object with the 'items' as well as a possible 'next' href.
 * If the 'next' href is provided, it can be called to retrieve the next batch of items.
 * This method recognizes such responses and fulfills all the 'next' queries to collect all the items.
 *
 * @param accessToken
 * @param url the url which when called returns ItemsResponse<T>
 * @param params
 * @see ItemsResponse
 */
export async function fetchAllItems<T>(accessToken: string, url: string, params?: Params): Promise<T[]> {
  const allItems: T[] = []

  let response: ItemsResponse<T> = await fetchSpotify(accessToken, url, { limit: 50, ...params })
  allItems.push(...response.items)
  while (response.next != null) {
    // iterate sequentially instead of using Promise.all with
    // parallel calls via usage of 'total' and 'offset' because
    // then we would increase the risk of hitting the rate limit
    response = await fetchSpotifyRaw(accessToken, response.next)
    allItems.push(...response.items)
  }

  return allItems
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
  
  if (result.status === 403) {
    const error = await result.text()
    // this text could change, but it's the only way to know what particular 403 issue happened
    if (error.startsWith("User not registered in the Developer Dashboard")) {
      throw new Error(SPOTIFY_BETA_ERROR + ": " + result.status + " " + error)
    } else {
      throw new Error("UNKNOWN ERROR: " + result.status + " " + error)
    }
  }

  const json = await result.json();
  if (json.error) {
    if (json.error.status === 401) {
      throw new Error(SPOTIFY_AUTH_ERROR + ": " + JSON.stringify(json.error))
    } else if (json.error.status === 429) {
      // 429 = rate limit exceeded, see: https://developer.spotify.com/documentation/web-api/concepts/rate-limits
      // 'Retry-After' header is provided in seconds.
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