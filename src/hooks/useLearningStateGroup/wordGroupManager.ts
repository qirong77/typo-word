import { message } from "antd";
import { getBookWords } from "../../books/getBookWords";
import { IWordInfo } from "./useLearningStateGroup";
import { getWordInfo } from "./getWordInfo";

export class WordGroupManager {
    private _group: IWordInfo[] = [];
    private _index = 0;
    private _currentWord: IWordInfo | null | undefined = null;
    private _maxGroupSize = 100;
    public groupSize = 5;
    public book = "";
    public onLoadingChange: (isLoading: boolean) => void;

    constructor(props: { book: string; groupSize: number; onLoadingChange: (isLoading: boolean) => void }) {
        this.book = props.book;
        this.groupSize = props.groupSize;
        this.onLoadingChange = props.onLoadingChange;
        this.updateGroup();
    }

    async updateGroup() {
        if (!this._group[this._index]) {
            this.onLoadingChange(true);
        }
        const bookWords = getBookWords(this.book);
        if (!bookWords.length) {
            message.error("当前词库为空");
            this.onLoadingChange(false);
            return [];
        }
        const totalSize = bookWords.length;
        const newGroup: IWordInfo[] = [];
        while (newGroup.length < this.groupSize) {
            const index = Math.floor(Math.random() * totalSize);
            const info = (await getWordInfo(bookWords[index])) as IWordInfo;
            newGroup.push(info);
        }
        this._group.push(...newGroup);
        this.onLoadingChange(false);
        this._clearUsedWords()
    }

    async nextWord() {
        if (!this._group[this._index]) {
            await this.updateGroup();
        }
        const word = this._group[this._index];
        this._index++;
        this._currentWord = word;
        if (this._index + this.groupSize > this._group.length) {
            this.updateGroup();
        }
        return word;
    }

    getCurrentWord() {
        return this._currentWord;
    }
    _clearUsedWords() {
        if (this._group.length > this._maxGroupSize) {
            this._group = this._group.slice(this._group.length - this._maxGroupSize);
            this._index = 0;
        }
    }
    reset() {
        this._group = [];
        this._index = 0;
        this._currentWord = null;
        return this.updateGroup();
    }
}
