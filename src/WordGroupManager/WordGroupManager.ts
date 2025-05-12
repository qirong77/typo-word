import { message } from "antd";
import { getBookWords } from "../books/getBookWords";

import { getWordInfo } from "./getWordInfo";
import { LoadingManager } from "./LoadingManger";
import { IWordInfo } from "../type";

export class WordGroupManager extends LoadingManager {
    private _group: IWordInfo[] = [];
    private _index = 0;
    private _groupSize = 5;
    private _book: string;
    constructor(book: string) {
        super();
        this._book = book;
    }
    async addNewWords() {
        const bookWords = getBookWords(this._book);
        if (!bookWords.length) {
            message.error("当前词库为空");
            return;
        }
        if (!this.currentWord) {
            this.onLoadingChange(true);
        }
        const totalSize = bookWords.length;
        const newGroup: IWordInfo[] = [];
        while (newGroup.length < this._groupSize) {
            const index = Math.floor(Math.random() * totalSize);
            const info = (await getWordInfo(bookWords[index])) as IWordInfo;
            newGroup.push(info);
        }
        this._group.push(...newGroup);
        this.onLoadingChange(false);
    }
    async nextWord() {
        this._index++;
        if (!this.currentWord) {
            await this.addNewWords();
        }
        if (this._group.length - this._index < this._groupSize) {
            this.addNewWords();
        }
        return this.currentWord;
    }
    setBook(book: string) {
        if (this._book !== book) {
            this._book = book;
            this._group = [];
            this._index = 0;
            this.addNewWords();
        }
    }
    get currentWord() {
        return this._group[this._index];
    }
}
