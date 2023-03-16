export function replaceDivBody(divEl: HTMLDivElement, body: Node) {
    clearDivBody(divEl)
    divEl.appendChild(body)
}

export function clearDivBody(divEl: HTMLDivElement) {
    for (const child of divEl.children) {
        divEl.removeChild(child)
    }
}