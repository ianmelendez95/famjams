export interface ItemsResponse<T> {
    next: string | null,
    items: T[]
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

export interface Track {
    added_by: {
        id: '12139552232'
    },
    name: string,
    track: {
        popularity: number
    }
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
