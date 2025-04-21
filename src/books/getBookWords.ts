import { unFamiliarWordsDataManager } from "../data";
import MiddleSchool from "./1-初中-顺序.json";
import HighSchool from "./2-高中-顺序.json";
import CET4 from "./3-CET4-顺序.json";
import CET6 from "./4-CET6-顺序.json";
import Graduate from "./5-考研-顺序.json";
import TOEFL from "./6-托福-顺序.json";
import SAT from "./7-SAT-顺序.json";
// const BOOKS = ["Graduate", "HighSchool", "MiddleSchool", "CET4", "CET6", "SAT", "TOEFL", "生词本"];
export function getBookWords(book: string): string[] {
    if (book === "生词本") {
        return unFamiliarWordsDataManager.getData().map((v) => v.word);
    }
    switch (book) {
        case "Graduate":
            return Graduate;
        case "HighSchool":
            return HighSchool;
        case "MiddleSchool":
            return MiddleSchool;
        case "CET4":
            return CET4;
        case "CET6":
            return CET6;
        case "SAT":
            return SAT;
        case "TOEFL":
            return TOEFL;
        default:
            return [];
    }
}
