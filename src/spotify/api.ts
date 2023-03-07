
export async function fetchPlaylist(code: string, playlistId: string): Promise<Playlist> {
  return await asyncSpotify(code, "playlists/" + playlistId)
}

export async function fetchUserProfile(code: string, userId: string): Promise<UserProfile> {
  return await asyncSpotify(code, "users/" + userId)
}

async function asyncSpotify<T>(code: string, path: string): Promise<T> {
  const result = await fetch("https://api.spotify.com/v1/" + path, {
    method: "GET", headers: { Authorization: `Bearer ${code}` }
  });

  const json = await result.json();

  if (json.error) {
    throw new Error("Server error: " + JSON.stringify(json.error))
  }

  return json
}
