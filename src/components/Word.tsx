import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { SoundOutlined } from "@ant-design/icons";
import { useWordInfo } from "../hooks/useWordInfo";

export function Word(props: { word: string; userInputWord: string; showRealWord: boolean }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const wordInfo = useWordInfo(props.word);
    useEffect(() => {
        // axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${props.word}`).then((res) => {
        //     // @ts-ignore
        //     const url = res.data[0]?.phonetics.find((item) => item.audio)?.audio;
        //     console.log(res.data);
        //     if (url) {
        //         console.log(url);
        //         audioRef.current!.src = url;
        //         audioRef.current!.play();
        //     }
        // });
    }, [props]);
    useEffect(() => {
        const timer = setInterval(() => {
            audioRef.current?.play();
        }, 3000);
        return () => {
            window.clearInterval(timer);
        };
    }, [props]);
    return (
        <div className="w-full h-screen flex justify-center items-center flex-col">
            <div className="relative w-80 h-20">
                <div className="absolute flex gap-3 text-5xl text-slate-500 left-1/2 transform -translate-x-1/2">
                    {props.word.split("").map((char, index) => {
                        return (
                            <span className={`w-10 text-center  h-12  text-slate-400 ${props.showRealWord ? "" : "hidden"}`} key={index}>
                                {char}
                            </span>
                        );
                    })}
                </div>
                <div className="absolute flex gap-3 text-5xl left-1/2 transform -translate-x-1/2">
                    {props.word.split("").map((char, index) => {
                        return (
                            <span
                                className="w-10 text-center border-b-2 border-solid h-12 border-slate-200"
                                key={index}
                                style={{
                                    color: char === props.userInputWord[index] ? "var(--color-slate-300)" : "red",
                                }}
                            >
                                {props.userInputWord[index]}
                            </span>
                        );
                    })}
                    <SoundOutlined
                        onClick={() => audioRef.current?.play()}
                        style={{ fontSize: "20px", color: "var(--color-slate-300)", cursor: "pointer", position: "absolute", right: -40, bottom: 10 }}
                    />
                </div>
            </div>
            <div className="mt-5"></div>
            <audio ref={audioRef}></audio>
        </div>
    );
}
