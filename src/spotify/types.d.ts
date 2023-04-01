export interface ItemsResponse<T> {
    next: string | null,
    items: T[]
}

/**
 * The 'playlist report' for a given user
 */
export interface Playlist {
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

export interface PlaylistTrack {
    added_by: {
        id: '12139552232'
    },
    name: string,
    track: {
        album: {
            release_date: string
        },
        explicit?: boolean,
        popularity: number
    },
    artists: {
        href: string,
        id: string
    }[]
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
