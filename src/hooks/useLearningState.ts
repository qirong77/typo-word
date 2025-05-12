import { useEffect, useRef, useState } from "react";
import { wordGroupManager } from "../WordGroupManager";
import { WordGroupManager } from "../WordGroupManager/WordGroupManager";
import { IWordInfo } from "../type";
import { TypeWordEvent } from "../event/TypeWordEvent";

export function useLearningState(book: string) {
    const wordGroupManagerRef = useRef<WordGroupManager>(wordGroupManager);
    const [word, setWord] = useState<IWordInfo>();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const handleNewWord = () => {
            wordGroupManagerRef.current.nextWord().then((word) => {
                setWord(word);
            });
        };
        const handleLoadingChange = (loading: boolean) => {
            setIsLoading(loading);
        };
        wordGroupManagerRef.current.registerLoadingChangeHandler(handleLoadingChange);

        TypeWordEvent.addEventListener("next-word", handleNewWord);
        return () => {
            TypeWordEvent.removeEventListener("next-word", handleNewWord);
            wordGroupManagerRef.current.unregisterLoadingChangeHandler(handleLoadingChange);
        };
    }, []);
    useEffect(() => {
        wordGroupManagerRef.current.setBook(book);
    }, [book]);
    return { word, isLoading };
}
