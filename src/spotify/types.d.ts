export interface UserPlaylists {
    items: UserPlaylist[],
    next: string,
    offset: number
}

/**
 * The 'playlist report' for a given user
 */
export interface UserPlaylist {
    id: string,
    images: Image[],
    name: string,
    tracks: {
        href: string,
        total: number
    }
}

export interface Playlist {
    tracks: {
        items: Track[]
    }
}

export interface Track {
    added_by: {
        id: '12139552232'
    },
    name: string
}

export interface UserProfile {
    id: string,
    display_name: string,
    images: Image[]
}

export interface Image {
    url: string;
    height: number;
    width: number;
}
