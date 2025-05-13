import { useEffect, useRef } from "react";
import { SoundOutlined } from "@ant-design/icons";
import { IWordInfo } from "../hooks/useLearningStateGroup/useLearningStateGroup";
import { TypeWordEvent } from "../event/TypeWordEvent";

export function Word(props: { word: IWordInfo; userInputWord: string; showRealWord: boolean }) {
    const audioRefAm = useRef<HTMLAudioElement>(null);
    const audioRefEn = useRef<HTMLAudioElement>(null);
    useEffect(() => {
        audioRefAm.current?.play();
    }, [props.word]);
    useEffect(() => {
        const handlePlaySound = () => {
            audioRefAm.current?.play();
        };
        TypeWordEvent.addEventListener("key-backquote", handlePlaySound);
        return () => {
            TypeWordEvent.removeEventListener("key-backquote", handlePlaySound);
        };
    }, []);
    return (
        <div className="w-full h-screen flex justify-center items-center flex-col">
            <div className="relative w-80 h-20">
                <div className="absolute flex gap-3 text-5xl text-slate-500 left-1/2 transform -translate-x-1/2">
                    {props.word.word.split("").map((char, index) => {
                        return (
                            <span className={`w-10 text-center  h-12  text-slate-500 ${props.showRealWord ? "" : "hidden"}`} key={index}>
                                {char}
                            </span>
                        );
                    })}
                </div>
                <div className="absolute flex gap-3 text-5xl left-1/2 transform -translate-x-1/2">
                    {props.word.word.split("").map((char, index) => {
                        return (
                            <span
                                className="w-10 text-center border-b-2 border-solid h-14 border-slate-200"
                                key={index}
                                style={{
                                    color:
                                        char.toLocaleLowerCase() === props.userInputWord[index]?.toLocaleLowerCase()
                                            ? "var(--color-green-400)"
                                            : "var(--color-red-500)",
                                }}
                            >
                                {props.userInputWord[index]}
                            </span>
                        );
                    })}
                </div>
            </div>
            <div className="my-5 flex gap-10">
                <span className="flex gap-2 cursor-pointer" onClick={() => audioRefAm.current?.play()}>
                    <span className="text-center mx-2 text-slate-400">美 [ {props.word.ph_am} ]</span>
                    <audio ref={audioRefAm} className=" hidden" src={props.word.ph_am_mp3}></audio>
                    <SoundOutlined style={{ fontSize: "18px", color: "var(--color-slate-300)", outline: "none" }} />
                </span>
                <span className="flex gap-2 cursor-pointer" onClick={() => audioRefEn.current?.play()}>
                    <span className="text-center mx-2 text-slate-400">英 [ {props.word.ph_en} ]</span>
                    <audio ref={audioRefEn} className="hidden" src={props.word.ph_en_mp3}></audio>
                    <SoundOutlined style={{ fontSize: "18px", color: "var(--color-slate-300)", outline: "none" }} />
                </span>
            </div>
            <div
                style={{
                    opacity: props.showRealWord ? "1" : "0",
                    marginTop: "10px",
                }}
            >
                {props.word.means.map((mean, index) => {
                    return (
                        <span className="text-center mx-2 text-slate-400" key={index}>
                            {mean}、
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
