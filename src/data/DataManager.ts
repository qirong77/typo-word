import { message } from "antd";

export class DataManager<T> {
    private _storageKey = "TypeWord_";
    private _needJsonParse = true;
    constructor(key: string, private _defaultData: T) {
        this._storageKey += key;
        if (typeof _defaultData === "string") {
            this._needJsonParse = false;
        }
        if (!this.getData()) {
            this.saveData(this._defaultData);
        }
    }
    getData(): T{
        if (!this._needJsonParse) return window.localStorage.getItem(this._storageKey)! as T;
        return JSON.parse(window.localStorage.getItem(this._storageKey)!);
    }
    saveData(newDta: T) {
        if (!this._needJsonParse) return window.localStorage.setItem(this._storageKey, newDta as string);
        localStorage.setItem(this._storageKey, JSON.stringify(newDta));
    }
    deleteDataByKey(key: string) {
        if (!this._needJsonParse) {
            console.error("不支持");
            message.error("不支持");
            return;
        }
        const oldData = this.getData() as T;
        // @ts-ignore
        delete oldData[key];
        this.saveData(oldData);
    }
    setProperty(key: keyof T, value: any) {
        if (!this._needJsonParse) {
            console.error("不支持");
            message.error("不支持");
            return;
        }
        const oldData = this.getData() as T;
        // @ts-ignore
        oldData[key] = value;
        this.saveData(oldData);
    }
    deleteDataArrayIndex(i: number) {
        const oldData = this.getData() as T;
        if (Array.isArray(oldData)) {
            oldData.splice(i, 1);
            this.saveData(oldData);
        }
    }
}
