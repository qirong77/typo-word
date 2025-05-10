import MiddleSchool from "./1-初中-顺序.json";
import HighSchool from "./2-高中-顺序.json";
import CET4 from "./3-CET4-顺序.json";
import CET6 from "./4-CET6-顺序.json";
import Graduate from "./5-考研-顺序.json";
import TOEFL from "./6-托福-顺序.json";
import SAT from "./7-SAT-顺序.json";
import { familarWordsDataManager, unFamiliarWordsDataManager } from "../data";
import { E_BOOKS } from "./E_BOOKS";
export function getBookWords(book: string): string[] {
    if (book === E_BOOKS.生词本) {
        return unFamiliarWordsDataManager.getData().map((v) => v.word);
    }
    if (book === E_BOOKS.熟悉本) {
        return familarWordsDataManager.getData().map((v) => v.word);
    }
    let result = [];
    switch (book) {
        case E_BOOKS.Graduate:
            result = Graduate;
            break;
        case E_BOOKS.HighSchool:
            result = HighSchool;
            break;
        case E_BOOKS.MiddleSchool:
            result = MiddleSchool;
            break;
        case E_BOOKS.CET4:
            result = CET4;
            break;
        case E_BOOKS.CET6:
            result = CET6;
            break;
        case E_BOOKS.SAT:
            result = SAT;
            break;
        case E_BOOKS.TOEFL:
            result = TOEFL;
            break;
        default:
            return [];
    }
    return filterBookWords(result);
}

function filterBookWords(bookWords: string[]) {
    const set = new Set<string>(...familarWordsDataManager.getData().map((v) => v.word));
    const result = bookWords.filter((v) => !set.has(v));
    return result;
}
