import { useEffect, useRef, useState } from "react";
import { Word } from "./components/Word";
import { LeaningState } from "./LearningState";
import { IWordInfo } from "./type";

export default () => {
    const [wordInfo, setWordInfo] = useState<IWordInfo>();
    const [userInputWord, setUserInputWord] = useState("");
    const learningStateRef = useRef(
        new LeaningState({
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
            setUserInputWord((v) => v + e.key);
        });
    }, []);
    useEffect(() => {
        if (!wordInfo) return;
        if (userInputWord === wordInfo?.word) {
            const nextWordInfo = learningStateRef.current.getNextWord();
            setTimeout(() => {
              setWordInfo(nextWordInfo);
              setUserInputWord("");
            },200)
            return
        }
        if (!wordInfo?.word.includes(userInputWord)) {
            learningStateRef.current.inputErrors.add(wordInfo?.word);
        }
    }, [userInputWord, wordInfo]);
    return (
        <div className=" w-screen h-screen flex justify-center items-center bg-slate-900">
            {wordInfo && <Word wordInfo={wordInfo} userInputWord={userInputWord} />}
        </div>
    );
};
