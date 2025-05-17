import { useEffect, useRef, useState } from "react";
import { wordGroupManager } from "../WordGroupManager";
import { WordGroupManager } from "../WordGroupManager/WordGroupManager";
import { IWordInfo } from "../type";

export function useLearningState(book: string) {
    const wordGroupManagerRef = useRef<WordGroupManager>(wordGroupManager);
    const [word, setWord] = useState<IWordInfo>();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const handleWordChange = (word: IWordInfo) => {
            setWord(word);
        };
        const handleLoadingChange = (loading: boolean) => {
            setIsLoading(loading);
        };
        wordGroupManagerRef.current.registerCurrentWordChangeHandler(handleWordChange);
        wordGroupManagerRef.current.registerLoadingChangeHandler(handleLoadingChange);
        wordGroupManagerRef.current.nextWord();
        return () => {
            wordGroupManagerRef.current.unregisterCurrentWordChangeHandler(handleWordChange);
            wordGroupManagerRef.current.unregisterLoadingChangeHandler(handleLoadingChange);
        };
    }, []);
    useEffect(() => {
        wordGroupManagerRef.current.setBook(book);
    }, [book]);
    return { word, isLoading };
}
