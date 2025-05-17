export function isSameWord(w1 = "", w2 = "") {
    return w1.toLowerCase() === w2.toLowerCase();
}

export function isInlucdesWord(w1 = "", w2 = "") {
    return w1.toLowerCase().includes(w2.toLowerCase());
}
export function uniqueArray<T=Object>(arr: T[],key: keyof T) {
    return [...new Map(arr.map(item => [item[key], item])).values()];
}

export function isCombinationKeyInput(e: KeyboardEvent) {
    let key = 0;
    if (/^[a-zA-Z]$/.test(e.key)) {
        key += 1;
    }
    if(e.code === 'Minus' || e.code === 'Equal') {
        key += 1;
    }
    if (e.code === "Tab") key += 1;
    if (e.altKey) key += 1;
    if (e.metaKey) key += 1;
    if (e.ctrlKey) key += 1;
    if (e.shiftKey) key += 1;
    return key > 1;
}
