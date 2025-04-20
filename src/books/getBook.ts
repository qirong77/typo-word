import { writeFileSync } from "fs";
import graduate from "./graduate.json";
// https://github.com/KyleBing/english-vocabulary
const r = [];
// @ts-ignore
for (let i = 0; i < graduate.length; i++) {
    // @ts-ignore
    r.push(graduate[i].word);
}

writeFileSync("./graduate-words.json", JSON.stringify(r));
