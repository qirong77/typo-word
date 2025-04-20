import { useCallback, useEffect, useRef, useState } from "react";
import graduate from "../books/graduate-words.json";
export interface IWordInfo {
    word: string;
    ph_en: string;
    ph_am: string;
    ph_am_mp3: string;
    ph_en_mp3: string;
    means: string[];
}
export function useLearningState(groupSize = 20, totalSize = graduate.length) {
    const [group, setGroup] = useState<IWordInfo[]>([]);
    const [word, setWord] = useState<IWordInfo>();
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const unFamiliarWordsRef = useRef<IWordInfo[]>([]);
    const markUnfamiliar = useCallback((word: IWordInfo) => {
        unFamiliarWordsRef.current.push(word);
    }, []);
    const saveUnfamiliarWords = useCallback(() => {
        const key = "unfamiliarWords";
        if (localStorage.getItem(key)) {
            const oldData = JSON.parse(localStorage.getItem(key) as string);
            localStorage.setItem(key, JSON.stringify([...oldData, ...unFamiliarWordsRef.current]));
            unFamiliarWordsRef.current = [];
            return;
        }
        localStorage.setItem(key, JSON.stringify(unFamiliarWordsRef.current));
        unFamiliarWordsRef.current = [];
    }, []);
    const updateGroup = useCallback(async () => {
        setIsLoading(true);
        const newGroup: IWordInfo[] = [];
        for (let i = 0; i < groupSize; i++) {
            const index = Math.floor(Math.random() * totalSize);
            const info = (await getWordInfo(graduate[index])) as IWordInfo;
            newGroup.push(info);
        }
        saveUnfamiliarWords();
        setGroup(newGroup);
        setWord(newGroup[0]);
        setCurrentWordIndex(0);
        setIsLoading(false);
    }, [markUnfamiliar, saveUnfamiliarWords]);

    useEffect(() => {
        updateGroup();
    }, [updateGroup]);
    const eatWord = async () => {
        setCurrentWordIndex(currentWordIndex + 1);
        const nextWord = group[currentWordIndex + 1];
        if (!nextWord) {
            await updateGroup();
            return;
        }
        setWord(nextWord);
    };
    return { word, eatWord, isLoading, markUnfamiliar };
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
