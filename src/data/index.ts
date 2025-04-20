import { DataManager } from "./DataManager";
export interface IUnfamiliarWords {
    word: string;
    means: string[];
}
export const unFamiliarWordsDataManager = new DataManager<IUnfamiliarWords[]>("UnfamiliarWords", []);