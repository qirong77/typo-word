import { IWordInfo } from "../type";

// 引入 p-limit 库
import pLimit from "p-limit";

const limit = pLimit(50); // 限制并发请求数量为 10

function getWordInfo(word: string) {
    const token = "_next/data/MUrLpJzKroaxTAYxLwZH4";
    return fetch(`https://www.iciba.com/${token}/word.json?w=` + word, {
        headers: {
            accept: "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            pragma: "no-cache",
            priority: "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-nextjs-data": "1",
            "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
    }).then((res) => res.json());
}

import MiddleSchool from "../books/1-初中-顺序.json";
import HighSchool from "../books/2-高中-顺序.json";
import CET4 from "../books/3-CET4-顺序.json";
import CET6 from "../books/4-CET6-顺序.json";
import Graduate from "../books/5-考研-顺序.json";
import TOEFL from "../books/6-托福-顺序.json";
import SAT from "../books/7-SAT-顺序.json";
import { writeFileSync } from "node:fs";

const words = {} as any;
let finishCount = 0;
let errorCount = 0;
let errorWords: string[] = [];
const totalWords = [MiddleSchool, HighSchool, CET4, CET6, Graduate, TOEFL, SAT].flat();

async function run() {
    const promises = totalWords.map((word) =>
        limit(() =>
            // 使用 p-limit 限制并发
            getWordInfo(word)
                .then((data) => {
                    const baseInfo = data.pageProps.initialReduxState.word.wordInfo.baesInfo.symbols[0] as any;
                    const info: IWordInfo = {
                        word: word,
                        ph_en: baseInfo.ph_en,
                        ph_am: baseInfo.ph_am,
                        ph_am_mp3: baseInfo.ph_am_mp3,
                        ph_en_mp3: baseInfo.ph_en_mp3,
                        means: baseInfo.parts?.[0]?.means || '',
                    };
                    words[word] = info;
                    finishCount++;
                    console.log("完成", finishCount + ": " + word);
                })
                .catch((e) => {
                    errorWords.push(word);
                    words[word] = {
                        word: word,
                        ph_en: "",
                        ph_am: "",
                        ph_am_mp3: "",
                        ph_en_mp3: "",
                        means: "",
                    };
                    errorCount++;
                    console.log("失败", errorCount + ": " + word);
                    console.log(e);
                })
        )
    );

    await Promise.all(promises);
    writeFileSync("./total-words.json", JSON.stringify(words));
    writeFileSync("./error-words.json", JSON.stringify(errorWords));
}

run();

// function testIsApiFine() {
//     getWordInfo("book").then((data) => {
//         console.log(data);
//     });
// }
// testIsApiFine()
