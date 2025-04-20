import { useEffect, useRef, useState } from "react";
import { Word } from "./components/Word";
import { useLearningState } from "./hooks/useLearningStateGroup";
import { Spin } from "antd";
import { InputStateBoard } from "./components/InputState";
import successAudioUrl from "../public/assets/correct.mp3";
import errorAudioUrl from "../public/assets/beep.mp3";
import { isInlucdesWord, isSameWord } from "./utils";
// import { Settings } from "./components/Settings";
export default () => {
    const { word, eatWord, isLoading, markUnfamiliar } = useLearningState(20);
    const [userInputWord, setUserInputWord] = useState("");
    const [showRealWord, setShowRealWord] = useState(false);
    const [inputState, setInputState] = useState({
        count: 0,
        errorCout: 0,
        timeElapsed: "00:00",
        accuracy: 0,
    });
    const successAudioRef = useRef<HTMLAudioElement>(null);
    const errorAudioRef = useRef<HTMLAudioElement>(null);
    useEffect(() => {
        let timer: any;
        let startTime: number = 0;

        const keydownHandler = (e: KeyboardEvent) => {
            if (e.key === "Backspace") {
                setUserInputWord((v) => v.slice(0, v.length - 1));
                return;
            }
            if (e.key === "Tab") {
                word && markUnfamiliar(word);
                setShowRealWord((v) => !v);
            }
            if (e.altKey || e.metaKey || e.shiftKey || e.ctrlKey) return;
            if (!/^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();
                return;
            }

            if (!timer) {
                startTime = Date.now();
                timer = setInterval(() => {
                    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                    const minutes = Math.floor(elapsedSeconds / 60);
                    const seconds = elapsedSeconds % 60;
                    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                    setInputState((v) => ({
                        ...v,
                        timeElapsed: formattedTime,
                    }));
                }, 1000);
            }

            setInputState((v) => ({ ...v, count: v.count + 1, accuracy: Math.floor(((v.count - v.errorCout) / v.count) * 100) }));
            setUserInputWord((v) => v + e.key);
        };

        document.addEventListener("keydown", keydownHandler);

        return () => {
            document.removeEventListener("keydown", keydownHandler);
            if (timer) {
                clearInterval(timer);
            }
        };
    }, []);
    useEffect(() => {
        if (!word) return;
        if (isSameWord(word.word, userInputWord)) {
            eatWord();
            setUserInputWord("");
            setShowRealWord(false);
            successAudioRef.current?.play();
            return;
        }
        if (!isInlucdesWord(word.word, userInputWord)) {
            errorAudioRef.current?.play();
            markUnfamiliar(word);
            setInputState((v) => ({ ...v, errorCout: v.errorCout + 1 }));
        }
    }, [userInputWord, word]);
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-slate-900">
            <div className="flex justify-center items-center" style={{ height: "80vh" }}>
                {isLoading && (
                    <div className="flex flex-col justify-center items-center">
                        <Spin size="large" />
                        <div className="text-slate-500" style={{ marginTop: "20px" }}>正在获取新的数据...</div>
                    </div>
                )}
                {!isLoading && word && <Word showRealWord={showRealWord} word={word} userInputWord={userInputWord} />}
            </div>
            <InputStateBoard {...inputState} />
            <audio ref={successAudioRef} src={successAudioUrl} />
            <audio ref={errorAudioRef} src={errorAudioUrl} />

            {/* <Settings /> */}
        </div>
    );
};
