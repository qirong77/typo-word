import { message } from "antd";
import { getBookWords } from "../books/getBookWords";

import { getWordInfo } from "./getWordInfo";
import { LoadingManager } from "./LoadingManger";
import { IWordInfo } from "../type";

export class WordGroupManager extends LoadingManager {
    private _group: IWordInfo[] = [];
    private _index = 0;
    private _groupSize = 5;
    public book: string;
    constructor(book: string) {
        super();
        this.book = book;
    }
    async addNewWords() {
        const bookWords = getBookWords(this.book);
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
        return this.currentWord;
    }
    get currentWord() {
        return this._group[this._index];
    }
}
