import { useEffect, useRef, useState } from "react";
import { Word } from "./components/Word";
import { LeaningStateGroup } from "./LearningStateGroup";
import { IWordInfo } from "./type";
import { Settings } from "./components/Settings";

export default () => {
    const [wordInfo, setWordInfo] = useState<IWordInfo>();
    const [userInputWord, setUserInputWord] = useState("");
    const [showRealWord, setShowRealWord] = useState(false);
    const errorCountRef = useRef(0);
    const learningStateRef = useRef(
        new LeaningStateGroup({
            onFinishGroup(params) {
                alert("完成一组");
            },
        })
    );
    useEffect(() => {
        const nextWordInfo = learningStateRef.current.getNextWord();
        setWordInfo(nextWordInfo);
        document.addEventListener("keydown", (e) => {
            if (e.key === "Backspace") {
                setUserInputWord((v) => v.slice(0, v.length - 1));
                return;
            }
            if (!/^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();
                return;
            }
            setUserInputWord((v) => v + e.key);
        });
    }, []);
    useEffect(() => {
        if (!wordInfo) return;
        if (userInputWord === wordInfo?.word) {
            const nextWordInfo = learningStateRef.current.getNextWord();
            errorCountRef.current = 0
            setTimeout(() => {
                setWordInfo(nextWordInfo);
                setUserInputWord("");
                setShowRealWord(false)
            }, 200);
            return;
        }
        if (!wordInfo?.word.includes(userInputWord)) {
            learningStateRef.current.inputErrors.push(wordInfo);
            errorCountRef.current++;
            if (errorCountRef.current === 3) {
                setShowRealWord(true);
            }
        }
    }, [userInputWord, wordInfo]);
    return (
        <div className=" w-screen h-screen flex justify-center items-center bg-slate-900">
            {wordInfo && <Word showRealWord={showRealWord} wordInfo={wordInfo} userInputWord={userInputWord} />}
            {/* <Settings /> */}
        </div>
    );
};
