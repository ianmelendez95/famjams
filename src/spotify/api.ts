
export async function fetchPlaylist(accessToken: string, playlistId: string): Promise<Playlist> {
  return await asyncSpotify(accessToken, "playlists/" + playlistId)
}

export async function fetchUserProfile(accessToken: string, userId: string): Promise<UserProfile> {
  return await asyncSpotify(accessToken, "users/" + userId)
}

async function asyncSpotify<T>(accessToken: string, path: string): Promise<T> {
  const result = await fetch("https://api.spotify.com/v1/" + path, {
    method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
  });

  const json = await result.json();

  if (json.error) {
    throw new Error("Server error: " + JSON.stringify(json.error))
  }

  return json
}
