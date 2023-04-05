import type {UserProfile} from "@/spotify/types";

const ids: { [key: string]: { name: string, image: string }} = {
    "12139552232": {
        "name": "Edd",
        "image": "/public/demo/edd.png"
    },
    "12130858093": {
        "name": "Bree",
        "image": "/public/demo/bree.jpeg"
    },
    "12161344738": {
        "name": "Angelica",
        "image": "/public/demo/angelica.png"
    },
    "12138830882": {
        "name": "Cyborg",
        "image": "/public/demo/cyborg.png"
    },
    "1290300266": {
        "name": "Muriel",
        "image": "/public/demo/muriel.png"
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
