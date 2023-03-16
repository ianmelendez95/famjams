export function getClientId(): string {
    // prevent low effort source swiping
    return new TextDecoder().decode(new Uint8Array([52,50,55,55,55,56,52,55,52,57,53,102,52,53,52,101,97,50,101,100,55,55,52,52,101,98,57,52,97,99,48,102]))
}

