import { useEffect, useRef } from "react";
import { IInputState } from "./useInputState";
import { historyDataManager } from "../data";

export function useRecordHistory(inputState: IInputState, book: string) {
    const id = useRef(new Date().getTime());
    useEffect(() => {
        id.current = new Date().getTime();
    }, [book]);
    useEffect(() => {
        const timer = setTimeout(() => {
            historyDataManager.objectSetProperty(id.current, {
                id: id.current,
                book,
                ...inputState,
            });
        }, 1000 * 30);
        return () => clearTimeout(timer);
    }, [inputState, book]);
}
