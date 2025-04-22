import { message } from "antd";
import { getBookWords } from "../../books/getBookWords";
import { IWordInfo } from "./useLearningStateGroup";
import { getWordInfo } from "./getWordInfo";

export class WordGroupManager {
    private _group: IWordInfo[] = [];
    private _index = 0;
    private _currentWord: IWordInfo | null = null;
    public groupSize = 5;
    public book = "";
    public setIsLoading: Function;
    constructor(props: { book: string; groupSize: number; setIsLoading: Function }) {
        this.book = props.book;
        this.groupSize = props.groupSize;
        this.updateGroup();
        this.setIsLoading = props.setIsLoading;
    }
    async updateGroup() {
        if (!this._group[this._index + 1]) {
            this.setIsLoading(true);
        }
        const bookWords = getBookWords(this.book);
        if (!bookWords.length) {
            message.error("当前词库为空");
            return [];
        }
        const totalSize = bookWords.length;
        const newGroup: IWordInfo[] = [];
        for (let i = 0; i < this.groupSize; i++) {
            const index = Math.floor(Math.random() * totalSize);
            const info = (await getWordInfo(bookWords[index])) as IWordInfo;
            newGroup.push(info);
        }
        this._group.push(...newGroup);
        this.setIsLoading(false);
    }
    async nextWord() {
        const word = this._group[this._index];
        if (!word) {
            await this.updateGroup();
        }
        this._index++;
        if (this._index % this.groupSize === 0) {
            this.updateGroup();
        }
        this._currentWord = word;
        return word;
    }
    getCurrentWord() {
        return this._currentWord;
    }
}
