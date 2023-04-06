const SESSION_LOCALE_NAME = "com.familyjamz.LOCALE"

export function resolveLocale() {
    const localeParam = new URLSearchParams(window.location.search).get('locale')
    if (localeParam) {
        // hard setting via param
        sessionStorage.setItem(SESSION_LOCALE_NAME, localeParam)
    }

    const sessionLocale = sessionStorage.getItem(SESSION_LOCALE_NAME)
    if (sessionLocale) {
        return sessionLocale
    } else if (window.location.hostname.endsWith(".mx")) {
        return 'es'
    } else {
        return 'en'
    }
}

export const messages = {
    en: {
        home: {
          authorizing: "Authorizing"
        },
        callback: {
            redirecting: "Redirecting"
        },
        enroll: {
            p1: "Your user has not been added to the development access list.",
            p2: "If you're interested in using the app please email ian.melendez.95@gmail.com with your full name and email associated with your Spotify account.",
            p3: "This is really just for friends and family. I just wanted this to sound like generic marketing material because that looks cool."
        },
        playlistSelect: {
            loading: "Loading Playlists",
            noneFound1: "No playlists with multiple contributors found.",
            noneFound2: "Start a playlist with your friends!",
            noneFound3: "(Or strangers if you're desperate)",
        },
        playlistStats: {
            analyzing: "Analyzing Playlist",
            quantity: {
                title: "Quantity is Quality",
                subtitle: "Number of Tracks Contributed"
            },
            popularity: {
                title: "Well... ya Basic",
                subtitle: "Average Track Popularity (0-100)"
            },
            year: {
                title: "Fell Off Your Dinosaur?",
                subtitle: "Average Track Release Date"
            },
            explicit: {
                title: "Mouth, Meet Soap",
                subtitle: "Number of explicit tracks"
            },
            artist: {
                title: "Loyal... or Maybe Boring",
                subtitle: "Number of Tracks by the Same Artist"
            }
        }
    },
    es: {
        home: {
            authorizing: "Autorizando"
        },
        callback: {
            redirecting: "Redirigiendo"
        },
        enroll: {
            p1: "Su usuario no ha sido agregado a la lista de acceso de desarrollo.",
            p2: "Si está interesado en usar la aplicación, envíe un correo electrónico a ian.melendez.95@gmail.com con su nombre completo y correo electrónico asociado con su cuenta de Spotify.",
            p3: "En realidad esto fue solo para amigos y familiares. Solo quería que sonara como material de marketing genérico porque se ve genial."
        },
        playlistSelect: {
            loading: "Descargando playlists",
            noneFound1: "No se encontraron playlists con múltiples colaboradores.",
            noneFound2: "Comienza un playlist con tus amigos!",
            noneFound3: "(O extraños si estás desesperado)",
        },
        playlistStats: {
            analyzing: "Analizando playlist",
            quantity: {
                title: "Cantidad es calidad",
                subtitle: "Número de pistas contribuidas"
            },
            popularity: {
                title: "Pues... eres del montón",
                subtitle: "Popularidad promedio de la pista"
            },
            year: {
                title: "Quieres tu cocol?",
                subtitle: "Fecha promedio de lanzamiento"
            },
            explicit: {
                title: "Huerco maleducado",
                subtitle: "Número de pistas explícitas"
            },
            artist: {
                title: "Leal... o tal vez aburrido",
                subtitle: "Número de pistas del mismo artista"
            }
        }
    }
}
