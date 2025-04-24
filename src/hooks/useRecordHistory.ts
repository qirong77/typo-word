import { useEffect, useRef } from "react";
import { IInputState } from "./useInputState";
import { historyDataManager } from "../data";

export function useRecordHistory(inputState: IInputState, book: string) {
    const id = useRef(new Date().getTime());
    useEffect(() => {
        const timer = setTimeout(() => {
            historyDataManager.objectSetProperty(id.current, {
                id: id.current,
                book,
                ...inputState,
            });
            console.log('inputState', inputState);
            console.log('newState',historyDataManager.getData())
        }, 1000 * 1);
        return () => clearTimeout(timer);
    }, [inputState, book]);
}
