import { useEffect, useRef, useState } from "react";
import { IWordInfo } from "../type";
import axios from "axios";
import { SoundOutlined } from "@ant-design/icons";

export function Word(props: { wordInfo: IWordInfo; userInputWord: string; showRealWord: boolean }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    console.log(props.wordInfo);
    useEffect(() => {
        axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${props.wordInfo.word}`).then((res) => {
            // @ts-ignore
            const url = res.data[0]?.phonetics.find((item) => item.audio)?.audio;
            if (url) {
                console.log(url);
                audioRef.current!.src = url;
                audioRef.current!.play();
            }
        });
    }, [props.wordInfo]);
    return (
        <div className="w-full h-screen flex justify-center items-center flex-col">
            <div className="relative w-80 h-20">
                <div className="absolute flex gap-3 text-5xl text-slate-500 left-1/2 transform -translate-x-1/2">
                    {props.wordInfo.word.split("").map((char, index) => {
                        return (
                            <span className={`w-10 text-center  h-12  text-slate-400 ${props.showRealWord ? "" : "hidden"}`} key={index}>
                                {char}
                            </span>
                        );
                    })}
                </div>
                <div className="absolute flex gap-3 text-5xl left-1/2 transform -translate-x-1/2">
                    {props.wordInfo.word.split("").map((char, index) => {
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
                        style={{ fontSize: "20px", color: "var(--color-slate-300)", cursor: "pointer",position:"absolute",right:-40,bottom:10 }}
                    />
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
            <audio ref={audioRef}></audio>
        </div>
    );
}
