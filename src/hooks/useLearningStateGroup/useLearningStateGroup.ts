import { useCallback, useEffect, useRef, useState } from "react";
import { TypeWordEvent } from "../../event/TypeWordEvent";

import { familarWordsDataManager, unFamiliarWordsDataManager } from "../../data";
import { WordGroupManager } from "./wordGroupManager";
export interface IWordInfo {
    word: string;
    ph_en: string;
    ph_am: string;
    ph_am_mp3: string;
    ph_en_mp3: string;
    means: string[];
}
export function useLearningState(groupSize = 3, book: string) {
    const [word, setWord] = useState<IWordInfo>();
    const [isLoading, setIsLoading] = useState(false);
    // 如果将构造函数放在 useRef 中,那么会造成死循环
    const wordGroupManager = useRef<WordGroupManager>();
    const nextWord = useCallback(() => {
        wordGroupManager.current!.nextWord().then((word) => {
            setWord(word);
        });
    }, []);
    useEffect(() => {
        wordGroupManager.current = new WordGroupManager({
            book,
            groupSize,
            onLoadingChange: (isLoading: boolean) => {
                setIsLoading(isLoading);
            },
        });
        const handleShift = () => {
            const word = wordGroupManager.current!.getCurrentWord();
            if (word) {
                familarWordsDataManager.arrayAddItem(word, "word");
                unFamiliarWordsDataManager.arrayDelectByMatch("word", word.word);
                nextWord();
            }
        };
        const handleNext = () => {
            nextWord();
        };
        const handleTab = () => {
            const word = wordGroupManager.current!.getCurrentWord();
            if (word) {
                unFamiliarWordsDataManager.arrayAddItem(word, "word");
            }
        };
        handleNext();
        TypeWordEvent.addEventListener("key-shift", handleShift);
        TypeWordEvent.addEventListener("next-word", handleNext);
        TypeWordEvent.addEventListener("key-tab", handleTab);
        return () => {
            TypeWordEvent.removeEventListener("key-shift", handleShift);
            TypeWordEvent.removeEventListener("next-word", handleNext);
            TypeWordEvent.removeEventListener("key-tab", handleTab);
        };
    }, []);
    useEffect(() => {
        wordGroupManager.current!.book = book;
        wordGroupManager.current!.groupSize = groupSize;
        wordGroupManager.current!.reset().then(() => {
            nextWord();
        });
    }, [groupSize, book]);
    return { word, isLoading };
}
