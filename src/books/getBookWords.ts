import { unFamiliarWordsDataManager } from "../data";
import MiddleSchool from "./1-初中-顺序.json";
import HighSchool from "./2-高中-顺序.json";
import CET4 from "./3-CET4-顺序.json";
import CET6 from "./4-CET6-顺序.json";
import Graduate from "./5-考研-顺序.json";
import TOEFL from "./6-托福-顺序.json";
import SAT from "./7-SAT-顺序.json";
// const BOOKS = ["Graduate", "HighSchool", "MiddleSchool", "CET4", "CET6", "SAT", "TOEFL", "生词本"];
export const E_BOOKS = {
    MiddleSchool: "MiddleSchool",
    HighSchool: "HighSchool",
    Graduate: "Graduate",
    CET4: "CET4",
    CET6: "CET6",
    SAT: "SAT",
    TOEFL: "TOEFL",
    生词本: "生词本",
};
export function getBookWords(book: string): string[] {
    if (book === E_BOOKS.生词本) {
        return unFamiliarWordsDataManager.getData().map((v) => v.word);
    }
    switch (book) {
        case E_BOOKS.Graduate:
            return Graduate;
        case E_BOOKS.HighSchool:
            return HighSchool;
        case E_BOOKS.MiddleSchool:
            return MiddleSchool;
        case E_BOOKS.CET4:
            return CET4;
        case E_BOOKS.CET6:
            return CET6;
        case E_BOOKS.SAT:
            return SAT;
        case E_BOOKS.TOEFL:
            return TOEFL;
        default:
            return [];
    }
}
