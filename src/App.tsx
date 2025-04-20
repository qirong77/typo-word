import { useEffect, useRef, useState } from "react";
import { Word } from "./components/Word";
import { useLearningState } from "./hooks/useLearningStateGroup";

// import { Settings } from "./components/Settings";
export default () => {
    const { word, eatWord } = useLearningState(20);
    const [userInputWord, setUserInputWord] = useState("");
    const [showRealWord, setShowRealWord] = useState(false);
    const errorCountRef = useRef(0);

    useEffect(() => {
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
            setUserInputWord((v) => v + e.key);
        });
    }, []);
    useEffect(() => {
        if (!word) return;
        if (userInputWord === word) {
            errorCountRef.current = 0;
            setTimeout(() => {
                eatWord();
                setUserInputWord("");
                setShowRealWord(false);
            }, 200);
            return;
        }
        if (!word.includes(userInputWord)) {
            errorCountRef.current++;
            if (errorCountRef.current === 3) {
                setShowRealWord(true);
            }
        }
    }, [userInputWord, word]);
    return (
        <div className="w-screen h-screen flex justify-center items-center bg-slate-900">
            {word && <Word showRealWord={showRealWord} word={word} userInputWord={userInputWord} />}
            {/* <Settings /> */}
        </div>
    );
};
