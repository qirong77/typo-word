import { DataManager } from "./DataManager";
export interface IUnfamiliarWords {
    word: string;
    means: string[];
}
export const unFamiliarWordsDataManager = new DataManager<IUnfamiliarWords[]>("UnfamiliarWords", []);

export const familarWordsDataManager = new DataManager<
    {
        word: string;
    }[]
>("FamilarWords", []);

export const userDataManager = new DataManager<{
    currentBook: string;
}>("HotKeys", {
    currentBook:'Graduate',
});

export const hotKeyDataManager = new DataManager<{label:string,value:string}[]>("HotKeys", []);
export const bookDataManager = new DataManager<string>("Book", 'Graduate');