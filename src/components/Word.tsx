import { IWordInfo } from "../type";

export function Word(props: { wordInfo: IWordInfo; userInputWord: string }) {
    return (
        <div className="w-full h-screen flex justify-center items-center flex-col">
            {/* 外层容器使用 h-screen 确保占满屏幕 */}
            <div className="relative w-80 h-20">
                <div className="absolute flex gap-5 text-5xl text-slate-500 left-1/2 transform -translate-x-1/2">
                    {/* 使用 left-1/2 和 transform -translate-x-1/2 实现水平居中 */}
                    {props.wordInfo.word.split("").map((char, index) => {
                        return (
                            <span className="w-10" key={index}>
                                {char}
                            </span>
                        );
                    })}
                </div>
                <div className="absolute flex gap-5 text-5xl left-1/2 transform -translate-x-1/2">
                    {props.wordInfo.word.split("").map((char, index) => {
                        return (
                            <span
                                className="w-10"
                                key={index}
                                style={{
                                    color: char === props.userInputWord[index] ? "var(--color-slate-300)" : "red",
                                }}
                            >
                                {props.userInputWord[index]}
                            </span>
                        );
                    })}
                </div>
            </div>
            <div className="mt-5">
                {props.wordInfo.translations.map((translation, index) => {
                    return (
                        <div className="flex gap-5 text-1xl text-slate-400" key={index}>
                            <span>{translation.type}.</span>
                            <span>{translation.translation}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}