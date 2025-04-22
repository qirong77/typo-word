import { useEffect, useRef, useState } from "react";
import { TypeWordEvent } from "../../event/TypeWordEvent";
import { WordGroupManager } from "./wordGroupManager";
import { familarWordsDataManager, unFamiliarWordsDataManager } from "../../data";
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
    const wordGroupManager = useRef(new WordGroupManager({ book, groupSize, setIsLoading: (isLoading: boolean) => setIsLoading(isLoading) }));
    useEffect(() => {
        wordGroupManager.current.book = book;
        wordGroupManager.current.groupSize = groupSize;
    }, [groupSize, book]);
    useEffect(() => {
        const handleShift = () => {
            const word = wordGroupManager.current.getCurrentWord();
            if (word) {
                familarWordsDataManager.arrayAddItem(word, "word");
            }
        };
        const handleNext = () => {
            wordGroupManager.current.nextWord().then((word) => {
                setWord(word);
            });
        };
        const handleTab = () => {
            const word = wordGroupManager.current.getCurrentWord();
            if (word) {
                unFamiliarWordsDataManager.arrayAddItem(word, "word");
            }
        };
        TypeWordEvent.addEventListener("key-shift", handleShift);
        TypeWordEvent.addEventListener("next-word", handleNext);
        TypeWordEvent.addEventListener("key-tab", handleTab);
        return () => {
            TypeWordEvent.removeEventListener("key-shift", handleShift);
            TypeWordEvent.removeEventListener("next-word", handleNext);
            TypeWordEvent.removeEventListener("key-tab", handleTab);
        };
    }, []);
    return { word, isLoading };
}
