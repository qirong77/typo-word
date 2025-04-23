import { E_BOOKS } from "../books/getBookWords";
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
}>("HotKeys", {
    currentBook: E_BOOKS.Graduate,
});
export type IHistory = {
    id: number;
    book: string;
} & IInputState;
export const historyDataManager = new DataManagerArray<IHistory>("records", []);
