import { useEffect, useRef, useState } from "react";
import { Word } from "./components/Word";
import { useLearningState } from "./hooks/useLearningStateGroup";
import { Spin } from "antd";
import { InputStateBoard } from "./components/InputState";
// import { Settings } from "./components/Settings";
export default () => {
    const { word, eatWord, isLoading } = useLearningState(2);
    const [userInputWord, setUserInputWord] = useState("");
    const [showRealWord, setShowRealWord] = useState(false);
    const [inputState, setInputState] = useState({
        count: 0,
        errorCout: 0,
        timeElapsed: "00:00",
        accuracy: 0,
    });
    const errorCountRef = useRef(0);
    useEffect(() => {
        let timer: any;
        document.addEventListener("keydown", (e) => {
            if (e.key === "Backspace") {
                setUserInputWord((v) => v.slice(0, v.length - 1));
                return;
            }
            if (e.altKey || e.metaKey || e.shiftKey || e.ctrlKey) return;
            if (!/^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();
                return;
            }
            if (!timer) {
                timer = setInterval(() => {
                    console.log('timer');
                    setInputState((v) => {
                        return {
                            ...v,
                            timeElapsed:'xx:xx'
                        };
                    });
                }, 1000);
            }
            setInputState((v) => ({ ...v, count: v.count + 1, accuracy: Math.floor(((v.count - v.errorCout) / v.count) * 100) }));
            setUserInputWord((v) => v + e.key);
            return () => {
                clearInterval(timer);
            };
        });
    }, []);
    useEffect(() => {
        if (!word) return;
        if (userInputWord === word.word) {
            errorCountRef.current = 0;
            eatWord();
            setUserInputWord("");
            setShowRealWord(false);
            return;
        }
        if (!word.word.includes(userInputWord)) {
            errorCountRef.current++;
            setInputState((v) => ({ ...v, errorCout: v.errorCout + 1 }));
            if (errorCountRef.current === 3) {
                setShowRealWord(true);
            }
        }
    }, []);
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-slate-900">
            {isLoading && <Spin size="large" />}
            {!isLoading && word && <Word showRealWord={showRealWord} word={word} userInputWord={userInputWord} />}
            <InputStateBoard {...inputState} />
            {/* <Settings /> */}
        </div>
    );
};
