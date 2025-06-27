import { useCallback, useEffect, useRef, useState } from "react";
import { isCombinationKeyInput, isInlucdesWord, isSameWord } from "../utils";

import { TypeWordEvent } from "../event/TypeWordEvent";
import { message } from "antd";
import { familarWordsDataManager, unFamiliarWordsDataManager, userDataManager } from "../data";
import { IWordInfo } from "../type";
import { wordGroupManager } from "../WordGroupManager";
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
    const [showRealWord, setShowRealWord] = useState(userDataManager.getData().defaultShowWord);
    const [showChinese, setShowChinese] = useState(false);
    const [userInputWord, setUserInputWord] = useState("");
    const showSettingRef = useRef(false);
    const [inputState, setInputState] = useState({
        count: 0,
        errorCout: 0,
        timeElapsed: "00:00",
        accuracy: 0,
        wordCount: 0,
    });
    const isCurrentWordUnFamiliar = useRef(false);
    const nextWordFn = useCallback(() => {
        wordGroupManager.nextWord();
        setShowRealWord(userDataManager.getData().defaultShowWord);
        setShowChinese(false);
        successAudioRef.current?.play();
        isCurrentWordUnFamiliar.current = false;
        setUserInputWord("");
        setInputState((v) => ({ ...v, wordCount: v.wordCount + 1 }));
    }, []);
    const preWordFn = useCallback(() => {
        wordGroupManager.prevWord();
        setShowRealWord(userDataManager.getData().defaultShowWord);
        setShowChinese(false);
        successAudioRef.current?.play();
        isCurrentWordUnFamiliar.current = false;
        setUserInputWord("");
        setInputState((v) => ({ ...v, wordCount: v.wordCount + 1 }));
    }, []);
    const handleTab = useCallback(() => {
        if (showRealWord && showChinese) {
            setShowChinese(false);
            setShowRealWord(userDataManager.getData().defaultShowWord);
            return;
        }
        if (!showRealWord && !showChinese) {
            setShowRealWord(true);
            return;
        }
        if (showRealWord && !showChinese) {
            setShowChinese(true);
            return;
        }
    }, [showChinese, showRealWord]);
    useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            if (showSettingRef.current) {
                return;
            }
            if ((e.code === "Minus" || e.code === "Equal") && e.metaKey) {
                return;
            }
            if (e.code === "Backspace" && e.metaKey) {
                setUserInputWord("");
                e.preventDefault();
                return;
            }
            if (isCombinationKeyInput(e)) {
                e.preventDefault();
                return;
            }
            if (e.isComposing) {
                message.error("请使用英文输入法");
                return;
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
                e.preventDefault();
                handleTab();
                return;
            }
            if (e.code === "Space" || e.code === "ArrowRight") {
                nextWordFn();
                return;
            }
            if (e.code === "ArrowLeft") {
                preWordFn();
                return;
            }
            if (e.code === "Minus") {
                message.info("已添加到熟词本");
                nextWordFn();
                word && familarWordsDataManager.arrayAddItem(word, "word");
                word && unFamiliarWordsDataManager.arrayDelectByMatch("word", word.word);
                return;
            }
            if (e.code === "Equal") {
                message.info("已添加到生词本");
                word && unFamiliarWordsDataManager.arrayAddItem(word, "word");
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
    }, [word, handleTab]);
    useEffect(() => {
        const handlerSetting = (visible: boolean) => {
            showSettingRef.current = visible;
        };
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
        TypeWordEvent.addEventListener("setting-visible-change", handlerSetting);
        return () => {
            window.clearInterval(timer);
            TypeWordEvent.removeEventListener("setting-visible-change", handlerSetting);
        };
    }, []);
    useEffect(() => {
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
    return { inputState, setInputState, showRealWord, userInputWord, nextWordFn, showChinese };
}
