import { useCallback, useEffect, useRef, useState } from "react";
import { isCombinationKeyInput, isInlucdesWord, isSameWord } from "../utils";

import { TypeWordEvent } from "../event/TypeWordEvent";
import { message } from "antd";
import { familarWordsDataManager, unFamiliarWordsDataManager } from "../data";
import { IWordInfo } from "../type";
export interface IInputState {
    count: number;
    errorCout: number;
    timeElapsed: string;
    accuracy: number;
    wordCount: number;
}
export function useInputState(
    word: IWordInfo | undefined,
    book: string,
    successAudioRef: React.RefObject<HTMLAudioElement>,
    errorAudioRef: React.RefObject<HTMLAudioElement>
) {
    const [showRealWord, setShowRealWord] = useState(false);
    const [userInputWord, setUserInputWord] = useState("");
    const [inputState, setInputState] = useState({
        count: 0,
        errorCout: 0,
        timeElapsed: "00:00",
        accuracy: 0,
        wordCount: 0,
    });
    const isCurrentWordUnFamiliar = useRef(false);
    const nextWordFn = useCallback(() => {
        setShowRealWord(false);
        successAudioRef.current?.play();
        isCurrentWordUnFamiliar.current = false;
        setUserInputWord("");
        setInputState((v) => ({ ...v, wordCount: v.wordCount + 1 }));
    }, []);
    useEffect(() => {
        setShowRealWord(false);
        const keydownHandler = (e: KeyboardEvent) => {
            if (isCombinationKeyInput(e)) {
                e.preventDefault();
                return;
            }
            if (e.isComposing) {
                message.error("请使用英文输入法");
            }
            if (e.key === "`") {
                TypeWordEvent.dispatchEvent("key-backquote");
                e.preventDefault();
                return;
            }
            if (e.key === "Backspace") {
                e.preventDefault();
                setUserInputWord((v) => v.slice(0, v.length - 1));
                return;
            }
            if (e.key === "Tab") {
                setInputState((v) => ({ ...v, errorCout: v.errorCout + 1 }));
                e.preventDefault();
                setShowRealWord((v) => !v);
                word && unFamiliarWordsDataManager.arrayAddItem(word, "word");
                isCurrentWordUnFamiliar.current = true;
                return;
            }
            if (e.code === "Space") {
                nextWordFn();
            }
            if (e.shiftKey) {
                setUserInputWord("");
                successAudioRef.current?.play();
                word && familarWordsDataManager.arrayAddItem(word, "word");
                word && unFamiliarWordsDataManager.arrayDelectByMatch("word", word.word);
                return;
            }
            if (!/^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();
                return;
            }

            setInputState((v) => ({ ...v, count: v.count + 1, accuracy: Math.floor(((v.count - v.errorCout) / v.count) * 100) }));
            setUserInputWord((v) => v + e.key);
        };
        document.addEventListener("keydown", keydownHandler);
        return () => {
            document.removeEventListener("keydown", keydownHandler);
        };
    }, [word]);
    useEffect(() => {
        let startTime: number = 0;
        startTime = Date.now();
        const timer = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsedSeconds / 60);
            const seconds = elapsedSeconds % 60;
            const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            setInputState((v) => ({
                ...v,
                timeElapsed: formattedTime,
            }));
        }, 1000);
        return () => {
            window.clearInterval(timer);
        };
    }, []);
    useEffect(() => {
        setInputState({
            count: 0,
            errorCout: 0,
            timeElapsed: "00:00",
            accuracy: 0,
            wordCount: 0,
        });
        setUserInputWord("");
    }, [book]);
    useEffect(() => {
        if (!word) return;
        if (isSameWord(word.word, userInputWord)) {
            setShowRealWord(true);
            setUserInputWord("");
            successAudioRef.current?.play();
            return;
        }
        if (!isInlucdesWord(word.word, userInputWord)) {
            errorAudioRef.current?.play();
            setInputState((v) => ({ ...v, errorCout: v.errorCout + 1 }));
        }
        if (userInputWord.length >= word.word.length) {
            setUserInputWord(userInputWord.slice(0, word.word.length));
        }
    }, [userInputWord, word]);
    return { inputState, setInputState, showRealWord, userInputWord, nextWordFn };
}
