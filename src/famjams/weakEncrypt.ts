
// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_2

// export function weakEncrypt(password: string, message: string): Promise<ArrayBuffer> {
//     const encoded = new TextEncoder().encode(message)
//     return window.crypto.subtle.encrypt({
//         name: "AES-CTR",
//         counter: COUNTER,
//         length: 64
//     }, password, encoded)
// }