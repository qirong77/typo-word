import graduate from "./books/graduate.json";
import { IWordInfo } from "./type";
type IOnFinishGroup = (params: { group: IWordInfo[]; inputErrors: IWordInfo[] }) => void;
export class LeaningStateGroup {
    group: IWordInfo[] = [];
    groupSize: number = 20;
    inputErrors: IWordInfo[] = [];
    currentIndex: number = 0;
    learnedGroups: any = [];
    onFinishGroup: IOnFinishGroup;
    constructor({ onFinishGroup }: { onFinishGroup: IOnFinishGroup }) {
        this.onFinishGroup = onFinishGroup;
        this.updateGroup();
    }

    recordError(word: IWordInfo): void {
        this.inputErrors.push(word);
    }
    updateGroup() {
        // @ts-ignore
        this._getRandomArray(this.groupSize, graduate.length as number).forEach((index) => {
            // @ts-ignore
            this.group.push(graduate[index]);
        });
    }
    recordLearnedGroup() {
        this.learnedGroups.push({
            time: Date.now(),
            timeStr: new Date().toLocaleString(),
            group: this.group,
            errorwords: [...this.inputErrors],
        });
    }
    getNextWord() {
        let word = this.group[this.currentIndex];
        if (!word) {
            if (this.inputErrors.length === 0) {
                this.recordLearnedGroup();
                this.updateGroup();
                this.onFinishGroup({ group: this.group, inputErrors: this.inputErrors });
                word = this.group[this.currentIndex];
            } else {
                this.group = [...this.inputErrors];
                this.inputErrors = [];
                this.currentIndex = 0;
                word = this.group[this.currentIndex];
            }
        }
        this.currentIndex++;
        return word;
    }
    private _getRandomArray(count = 1, size = 100): number[] {
        const arr = [];
        for (let i = 0; i < count; i++) {
            arr.push(Math.floor(Math.random() * size));
        }
        return arr;
    }
}
