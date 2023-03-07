interface Image {
    url: string;
    height: number;
    width: number;
}

interface Playlist {
    tracks: {
        items: Track[]
    }
}

interface Track {
    added_by: {
        id: '12139552232'
    },
    name: string
}

interface UserProfile {
    display_name: string
}
