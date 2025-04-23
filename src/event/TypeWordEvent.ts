type EventType = "key-shift" | "next-word" | 'key-tab' | 'key-backquote' | 'book-change';
export const TypeWordEvent = {
    dispatchEvent(eventName: EventType, detail: any = undefined) {
        const event = new CustomEvent(eventName, { detail });
        window.dispatchEvent(event);
    },
    addEventListener(eventName: EventType, callback: (detail: any) => void) {
        window.addEventListener(eventName, (e) => {
            callback((e as CustomEvent).detail);
        });
    },
    removeEventListener(eventName: EventType, callback: (detail: any) => void) {
        window.removeEventListener(eventName, (e) => {
            callback((e as CustomEvent).detail);
        });
    },
};
