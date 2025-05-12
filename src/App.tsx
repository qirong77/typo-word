import { useEffect, useRef, useState } from "react";
import { Word } from "./components/Word";
import { Spin } from "antd";
import { InputStateBoard } from "./components/InputState";
import successAudioUrl from "../public/assets/correct.mp3";
import errorAudioUrl from "../public/assets/beep.mp3";
import { ToolBar } from "./components/ToolBar";
import { userDataManager } from "./data";
import { ConfigProvider, theme } from "antd";
import { useInputState } from "./hooks/useInputState";
import { useRecordHistory } from "./hooks/useRecordHistory";
import { TypeWordEvent } from "./event/TypeWordEvent";
import { useLearningState } from "./hooks/useLearningState";
export default () => {
    const [book, setBook] = useState(userDataManager.getData().currentBook);
    const { word, isLoading } = useLearningState(book);
    const successAudioRef = useRef<HTMLAudioElement>(null);
    const errorAudioRef = useRef<HTMLAudioElement>(null);
    const { inputState, showRealWord, userInputWord } = useInputState(word!,book, successAudioRef, errorAudioRef);
    useRecordHistory(inputState, book);
    useEffect(() => {
        const fn = (newBook: string) => {
            setBook(newBook);
            userDataManager.saveData({
                currentBook: newBook,
            });
        };
        TypeWordEvent.addEventListener("book-change", fn);
        return () => {
            TypeWordEvent.removeEventListener("book-change", fn);
        };
    }, []);
    return (
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
            <div className="w-screen h-screen flex flex-col justify-center items-center bg-slate-900">
                <div className="flex justify-center items-center" style={{ height: "80vh" }}>
                    {isLoading && (
                        <div className="flex flex-col justify-center items-center">
                            <Spin size="large" />
                            <div className="text-slate-500" style={{ marginTop: "20px" }}>
                                正在获取新的数据...
                            </div>
                        </div>
                    )}
                    {!isLoading && word && <Word showRealWord={showRealWord} word={word} userInputWord={userInputWord} />}
                </div>
                <InputStateBoard {...inputState} />
                <audio ref={successAudioRef} src={successAudioUrl} />
                <audio ref={errorAudioRef} src={errorAudioUrl} />
                <ToolBar book={book} />
            </div>
        </ConfigProvider>
    );
};
