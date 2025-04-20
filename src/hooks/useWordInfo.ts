import { useEffect } from "react";
/* 
https://www.iciba.com/word?w=book
*/
export function useWordInfo(word: string) {
    useEffect(() => {
        fetch("https://www.iciba.com/_next/data/Y2AE54C8Dcaen1N6q8u_N/word.json?w=" + word, {
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
        })
            .then((res) => res.json())
            .then((res) => console.log(res));
    }, [word]);
    return {};
}
