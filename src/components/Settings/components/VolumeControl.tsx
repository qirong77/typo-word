import { Slider } from "antd";
import { useEffect, useState } from "react";

export function VolumeControl() {
    const [volume, setVolume] = useState(100);

    useEffect(() => {
        // 初始化时从localStorage获取音量设置，如果没有则默认为100
        const savedVolume = localStorage.getItem("typo-word-volume");
        if (savedVolume) {
            setVolume(parseInt(savedVolume));
        }
    }, []);

    const handleVolumeChange = (value: number) => {
        setVolume(value);
        localStorage.setItem("typo-word-volume", value.toString());
        // 获取所有音频元素并设置音量
        const audioElements = document.getElementsByTagName("audio");
        for (let i = 0; i < audioElements.length; i++) {
            audioElements[i].volume = value / 100;
        }
    };

    return (
        <div style={{ width: 500, padding: "20px 0" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 12 }}>音量：</span>
                <Slider
                    style={{ flex: 1 }}
                    value={volume}
                    onChange={handleVolumeChange}
                    min={0}
                    max={100}
                    step={1}
                />
                <span style={{ marginLeft: 12 }}>{volume}%</span>
            </div>
        </div>
    );
}