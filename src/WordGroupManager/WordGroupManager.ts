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
    private _onCurrentWordChange: Function[] = [];
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
        this._onCurrentWordChange.forEach((handler) => {
            handler(this.currentWord);
        });
        return this.currentWord;
    }
    async prevWord() {
        this._index--;
        if (this._index < 0) {
            this._index = 0;
        }
        this._onCurrentWordChange.forEach((handler) => {
            handler(this.currentWord);
        });
        return this.currentWord;
    }
    registerCurrentWordChangeHandler(handler: Function) {
        this._onCurrentWordChange.push(handler);
    }
    unregisterCurrentWordChangeHandler(handler: Function) {
        this._onCurrentWordChange = this._onCurrentWordChange.filter((h) => h !== handler);
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
