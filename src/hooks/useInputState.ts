import { useEffect, useState } from "react";
import { isCombinationKeyInput, isInlucdesWord, isSameWord } from "../utils";
import { IWordInfo } from "./useLearningStateGroup/useLearningStateGroup";
import { TypeWordEvent } from "../event/TypeWordEvent";

export function useInputState(
    word: IWordInfo | undefined,
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
    });
    useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            if (isCombinationKeyInput(e)) {
                e.preventDefault();
                return;
            }
            if (e.isComposing) return;
            if (e.key === "Backspace") {
                e.preventDefault();
                setUserInputWord((v) => v.slice(0, v.length - 1));
                return;
            }
            if (e.key === "Tab") {
                setInputState((v) => ({ ...v, errorCout: v.errorCout + 1 }));
                e.preventDefault();
                setShowRealWord((v) => !v);
                return;
            }
            if (e.shiftKey) {
                setUserInputWord("");
                successAudioRef.current?.play();
                TypeWordEvent.dispatchEvent('key-shift')
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
    }, []);
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
        if (!word) return;
        if (isSameWord(word.word, userInputWord)) {
            setTimeout(() => {
                setUserInputWord("");
                setShowRealWord(false);
                successAudioRef.current?.play();
                TypeWordEvent.dispatchEvent('next-word')
            }, 250);
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
    return { inputState, setInputState, showRealWord, userInputWord };
}
