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
                title1: "Quantity",
                title2: "is",
                title3: "Quality",
                subtitle: "Number of Tracks Contributed"
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
            loading: "Descargando Playlists",
            noneFound1: "No se encontraron playlists con múltiples colaboradores.",
            noneFound2: "Comienza un playlist con tus amigos!",
            noneFound3: "(O extraños si estás desesperado)",
        },
        playlistStats: {
            analyzing: "Analizando Playlist",
            quantity: {
                title1: "Cantidad",
                title2: "es",
                title3: "Calidad",
                subtitle: "Número de Pistas Contribuidas"
            }
        }
    }
}
