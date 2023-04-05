import type {UserProfile} from "@/spotify/types";

const ids: { [key: string]: { name: string, image: string }} = {
    "12139552232": {
        "name": "Edd",
        "image": "/demo/edd.png"
    },
    "12130858093": {
        "name": "Bree",
        "image": "/demo/bree.jpeg"
    },
    "12161344738": {
        "name": "Angelica",
        "image": "/demo/angelica.png"
    },
    "12138830882": {
        "name": "Cyborg",
        "image": "/demo/cyborg.png"
    },
    "1290300266": {
        "name": "Muriel",
        "image": "/demo/muriel.png"
    }
}

export function replaceDemoData(user: UserProfile): UserProfile {
    const replace = ids[user.id]
    if (replace) {
        user.display_name = replace.name
        user.images = [{
            url: replace.image,
            width: 200,
            height: 200
        }]
    }
    return user
}
