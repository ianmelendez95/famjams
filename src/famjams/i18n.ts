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
            }
        }
    }
}
