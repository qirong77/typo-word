import { useEffect, useRef, useState } from "react";
import { Word } from "./components/Word";
import { useLearningState } from "./hooks/useLearningStateGroup";
import { Spin } from "antd";
import { InputStateBoard } from "./components/InputState";
import successAudioUrl from "../public/assets/correct.mp3";
import errorAudioUrl from "../public/assets/beep.mp3";
import { isCombinationKeyInput, isInlucdesWord, isSameWord } from "./utils";
import { ToolBar } from "./components/ToolBar";
import { familarWordsDataManager, unFamiliarWordsDataManager, userDataManager } from "./data";
// main.tsx
import { ConfigProvider, theme } from "antd";
import { useInputState } from "./hooks/useInputState";
export default () => {
    const [book, setBook] = useState(userDataManager.getData().currentBook);
    const { word, eatWord, isLoading } = useLearningState(5, book);
    const successAudioRef = useRef<HTMLAudioElement>(null);
    const errorAudioRef = useRef<HTMLAudioElement>(null);
    const { inputState, showRealWord, userInputWord } = useInputState(word!, successAudioRef, errorAudioRef);

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
                <ToolBar
                    onChangeBook={(value) => {
                        setBook(value);
                        userDataManager.objectSetProperty("currentBook", value);
                    }}
                />
            </div>
        </ConfigProvider>
    );
};
