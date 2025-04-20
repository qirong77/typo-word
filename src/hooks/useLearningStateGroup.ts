import { useCallback, useEffect, useState } from "react";
import graduate from "../books/graduate-words.json";
export interface IWordInfo {
    word: string;
    ph_en: string;
    ph_am: string;
    ph_am_mp3: string;
    ph_en_mp3: string;
    means: string[];
}
export function useLearningState(groupSize = 20) {
    const [group, setGroup] = useState<IWordInfo[]>([]);
    const [word, setWord] = useState<IWordInfo>();
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const updateGroup = useCallback(async () => {
        const newGroup: IWordInfo[] = [];
        for (let i = 0; i < groupSize; i++) {
            const index = Math.floor(Math.random() * groupSize);
            const info = await getWordInfo(graduate[index]) as IWordInfo;
            newGroup.push(info);
        }
        setGroup(newGroup);
        setWord(newGroup[0]);
    }, []);
    useEffect(() => {
        updateGroup();
    }, [updateGroup]);
    const eatWord = () => {
        setCurrentWordIndex((v) => v + 1);
        const word = group[currentWordIndex];
        if (!word) {
            updateGroup();
            return;
        }
        setWord(word);
    };
    return { word, eatWord };
}
// https://www.iciba.com/word?w=book
function getWordInfo(word: string) {
    const url = "https://nvmwtbxkogzhldqnlrbl.supabase.co/functions/v1/hello-world";
    const headers = {
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52bXd0Ynhrb2d6aGxkcW5scmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxMzM1MDQsImV4cCI6MjA2MDcwOTUwNH0.UUanhl-mcgYKoXswOooQn3pupYpxNI-IyVfewRIeztY",
        "Content-Type": "application/json",
    };
    const data = {
        name: word,
    };

    return fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const baseInfo = data.pageProps.initialReduxState.word.wordInfo.baesInfo.symbols[0] as any;
            const info: IWordInfo = {
                word,
                ph_en: baseInfo.ph_en,
                ph_am: baseInfo.ph_am,
                ph_am_mp3: baseInfo.ph_am_mp3,
                ph_en_mp3: baseInfo.ph_en_mp3,
                means: baseInfo.parts[0].means,
            };
            return info;
        })
        .catch((error) => console.error("Fetch error:", error));
}
