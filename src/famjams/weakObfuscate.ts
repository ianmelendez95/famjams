// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_2

const SALT = new Uint8Array([169,120,79,71,1,116,120,232,215,35,4,169,223,47,17,217])
const IV = new Uint8Array([78,153,54,155,118,170,221,216,70,154,222,247])

/**
 * 'Obfuscate' because it can hardly be called encryption.
 * The salt AND the IV are available in the source.
 * This is just to avoid low-effort swiping of application information.
 */
export async function obfuscate(password: string, message: string): Promise<string> {
    const key: CryptoKey = await getPasswordKey(password)

    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: IV },
        key,
        new TextEncoder().encode(message)
    )

    return arrayToHexString(new Uint8Array(encrypted))
}

/**
 * 'De-Obfuscate' because it can hardly be called encryption.
 * The salt AND the IV are available in the source.
 * This is just to avoid low-effort swiping of application information.
 */
export async function deObfuscate(password: string, message: string): Promise<string> {
    const key: CryptoKey = await getPasswordKey(password)

    try {
        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: IV },
            key,
            hexStringToArray(message)
        )

        return new TextDecoder().decode(decrypted)
    } catch (e) {
        console.error("Error: ", e)
        throw e
    }
}

async function getPasswordKey(password: string): Promise<CryptoKey> {
    const material = await getPasswordKeyMaterial(password)
    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: SALT,
            iterations: 100000,
            hash: "SHA-256"
        },
        material,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    )
}

async function getPasswordKeyMaterial(password: string): Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    )
}

function arrayToHexString(array: Uint8Array): string {
    let res = ''
    for (const n of array) {
        const encoded = n.toString(16)
        if (encoded.length < 2) {
            res += '0' + encoded
        } else {
            res += encoded
        }
    }
    return res
}

function hexStringToArray(input: string): Uint8Array {
    const array: Uint8Array = new Uint8Array(input.length / 2)
    for (let i = 0; i < input.length; i = i + 2) {
        array[i / 2] = parseInt(input.slice(i, i + 2), 16)
    }
    return array
}