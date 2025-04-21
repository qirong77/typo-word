import { useCallback, useEffect, useRef, useState } from "react";

import { familarWordsDataManager, IUnfamiliarWords, unFamiliarWordsDataManager } from "../data";
import { getBookWords } from "../books/getBookWords";
import { message } from "antd";
import { uniqueArray } from "../utils";
import { TypeWordEvent } from "../event/TypeWordEvent";
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
    const updateGroup = async () => {
        setIsLoading(true);
        setCurrentWordIndex(0);
        setIsLoading(false);
    };
    const eatWord = async () => {
        setCurrentWordIndex(currentWordIndex + 1);
        const nextWord = group[currentWordIndex + 1];
        if (!nextWord) {
            await updateGroup();
            return;
        }
        setWord(nextWord);
    };
    useEffect(() => {
        const handleShift = () => {};
        const handleNext = () => {

        };
        TypeWordEvent.addEventListener("key-shift", handleShift);
        TypeWordEvent.addEventListener("next-word", handleNext);
        return () => {
            TypeWordEvent.removeEventListener("key-shift", handleShift);
            TypeWordEvent.removeEventListener("next-word", handleNext);
        };
    }, []);
    return { word, eatWord, isLoading };
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

class wordGroupManager {
    private _group: IWordInfo[] = [];
    public groupSize = 3;
    public book = "book";
    constructor(book: string, groupSize: number) {
        this.book = book;
        this.groupSize = groupSize;
        this.initialize();
    }
    private async initialize() {
        const newGroup = await this.createGroup();
        this._group = newGroup;
    }
    async createGroup() {
        const bookWords = getBookWords(this.book);
        if (!bookWords.length) {
            message.error("当前词库为空");
            return [];
        }
        const totalSize = bookWords.length;
        const newGroup: IWordInfo[] = [];
        for (let i = 0; i < this.groupSize; i++) {
            const index = Math.floor(Math.random() * totalSize);
            const info = (await getWordInfo(bookWords[index])) as IWordInfo;
            newGroup.push(info);
        }
        return newGroup;
    }
    getGroup() {
        this._group = this._group;
        return this._group;
    }
}
