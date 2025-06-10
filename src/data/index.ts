import { E_BOOKS } from "../books/E_BOOKS";
import { IInputState } from "../hooks/useInputState";
import { DataManagerArray, DataManagerObject } from "./DataManager";
export interface IUnfamiliarWords {
    word: string;
    means: string[];
}
export const unFamiliarWordsDataManager = new DataManagerArray<IUnfamiliarWords>("UnfamiliarWords", []);

export const familarWordsDataManager = new DataManagerArray<{
    word: string;
}>("FamilarWords", []);

export const userDataManager = new DataManagerObject<{
    currentBook: string;
    defaultShowWord: boolean;
}>("HotKeys", {
    currentBook: E_BOOKS.Graduate,
    defaultShowWord: true,
});
export type IHistory = {
    id: number;
    book: string;
} & IInputState;
export const historyDataManager = new DataManagerObject<{ [key: number]: IHistory }>("Records", {});
