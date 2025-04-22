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
    currentBook: "Graduate",
});
