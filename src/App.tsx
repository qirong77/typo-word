import { useEffect, useRef, useState } from "react";
import { Word } from "./components/Word";
import { useLearningState } from "./hooks/useLearningStateGroup";
import { Spin } from "antd";
import { InputStateBoard } from "./components/InputState";
import successAudioUrl from '@assets/correct.mp3'
import errorAudioUrl from '@assets/error.mp3'
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
                    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    
                    setInputState((v) => ({
                        ...v,
                        timeElapsed: formattedTime
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
        if (userInputWord === word.word) {
            errorCountRef.current = 0;
            eatWord();
            setUserInputWord("");
            setShowRealWord(false);
            successAudioRef.current?.play();
            return;
        }
        if (!word.word.includes(userInputWord)) {
            errorAudioRef.current?.play();
            errorCountRef.current++;
            setInputState((v) => ({ ...v, errorCout: v.errorCout + 1 }));
            if (errorCountRef.current === 3) {
                setShowRealWord(true);
            }
        }
    }, [userInputWord,word]);
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-slate-900">
            <div className="flex justify-center items-center" style={{ height: '80vh' }}>
                {isLoading && <Spin size="large" />}
                {!isLoading && word && <Word showRealWord={showRealWord} word={word} userInputWord={userInputWord} />}
            </div>
            <InputStateBoard {...inputState} />
            <audio ref={successAudioRef} src={successAudioUrl}/>
            <audio ref={errorAudioRef} src={errorAudioUrl}/>

            {/* <Settings /> */}
        </div>
    );
};
