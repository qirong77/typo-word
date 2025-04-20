import { useCallback, useEffect, useState } from "react";
import graduate from "../books/graduate-words.json";
console.log(graduate)
export function useLearningState(groupSize = 20) {
    const [group, setGroup] = useState<string[]>([]);
    const [word, setWord] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
    const updateGroup = useCallback(() => {
        const newGroup: string[] = [];
        for (let i = 0; i < groupSize; i++) {
            const index = Math.floor(Math.random() * groupSize);
            // @ts-ignore
            newGroup.push(graduate[index]);
        }
        setGroup(newGroup);
        setWord(newGroup[0]);
    }, []);
    useEffect(() => {
        updateGroup();
    }, [updateGroup]);
    const eatWord = () => {
        setCurrentWordIndex((v) => v + 1);
        const word = group[currentWordIndex];
        if (!word) {
            updateGroup();
            return;
        }
        setWord(word);
    };
    return { word, eatWord };
}
