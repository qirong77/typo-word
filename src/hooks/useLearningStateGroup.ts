import { useCallback, useEffect, useRef, useState } from "react";

import { familarWordsDataManager, IUnfamiliarWords, unFamiliarWordsDataManager } from "../data";
import { getBookWords } from "../books/getBookWords";
import { message } from "antd";
import { uniqueArray } from "../utils";
export interface IWordInfo {
    word: string;
    ph_en: string;
    ph_am: string;
    ph_am_mp3: string;
    ph_en_mp3: string;
    means: string[];
}

export function useLearningState(groupSize = 3, book: string) {
    const [group, setGroup] = useState<IWordInfo[]>([]);
    const [word, setWord] = useState<IWordInfo>();
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const groupCacheRef = useRef<IWordInfo[]>([]);
    const unFamiliarWordsRef = useRef<IUnfamiliarWords[]>([]);
    const wordRef = useRef<IWordInfo>();
    const markUnfamiliar = useCallback(() => {
        if(!wordRef.current) return;
        unFamiliarWordsRef.current.push({
            word: wordRef.current!.word,
            means: wordRef.current!.means,
        });
    }, []);
    const createGroup = useCallback(async () => {
        const familarWordSet = new Set();
        familarWordsDataManager.getData().forEach((item) => {
            familarWordSet.add(item.word);
        });
        const bookWords = getBookWords(book);
        if (!bookWords.length) {
            message.error("当前词库为空");
            return [];
        }
        const totalSize = bookWords.length;
        let newGroup: IWordInfo[] = [];
        for (let i = 0; i < groupSize; i++) {
            const index = Math.floor(Math.random() * totalSize);
            const info = (await getWordInfo(bookWords[index])) as IWordInfo;
            newGroup.push(info);
        }
        newGroup = newGroup.filter((item) => {
            return !familarWordSet.has(item.word);
        });
        if (!newGroup.length) {
            console.log("reload");
            newGroup = await createGroup();
            return newGroup;
        }
        return newGroup;
    }, [book]);
    const updateGroup = useCallback(async () => {
        setIsLoading(true);
        const oldData = unFamiliarWordsDataManager.getData();
        unFamiliarWordsDataManager.saveData(uniqueArray([...oldData, ...unFamiliarWordsRef.current], "word"));
        unFamiliarWordsRef.current = [];
        let newGroup: IWordInfo[] = [];
        if (groupCacheRef.current.length) {
            newGroup = groupCacheRef.current;
            groupCacheRef.current = [];
        } else {
            newGroup = await createGroup();
        }
        setGroup(newGroup);
        setWord(newGroup[0]);
        setCurrentWordIndex(0);
        setIsLoading(false);
    }, [createGroup]);
    useEffect(() => {
        if (!group.length) return;
        const updateCache = async () => {
            const newGroup = await createGroup();
            groupCacheRef.current = newGroup;
        };
        updateCache();
    }, [group, createGroup]);
    useEffect(()=>{
        groupCacheRef.current = [];
        updateGroup()
    },[book])
    useEffect(() => {
        wordRef.current = word
        if (!group.length && word) {
            updateGroup();
        }
    }, [word]);
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
