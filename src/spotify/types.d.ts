export interface UserPlaylists {
    items: UserPlaylist[],
    next: string | null,
    offset: number,
    total: number
}

/**
 * The 'playlist report' for a given user
 */
export interface UserPlaylist {
    id: string,
    collaborative: boolean,
    images: Image[],
    name: string,
    tracks: {
        href: string,
        total: number
    },
    owner: {
        display_name: string
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
