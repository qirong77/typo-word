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
    getData(): T {
        if (!this._needJsonParse) return window.localStorage.getItem(this._storageKey)! as T;
        return JSON.parse(window.localStorage.getItem(this._storageKey)!);
    }
    saveData(newDta: T) {
        if (!this._needJsonParse) return window.localStorage.setItem(this._storageKey, newDta as string);
        localStorage.setItem(this._storageKey, JSON.stringify(newDta));
    }
    objectDeleteDataByKey(key: string) {
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
    objectSetProperty(key: keyof T, value: any) {
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
    arrayDelectByMatch(key: string, value: any) {
        // @ts-ignore
        const index = this.getData().findIndex((item) => item[key] === value);
        const oldData = this.getData() as T;
        if (Array.isArray(oldData) && index !== -1) {
            oldData.splice(index, 1);
            this.saveData(oldData);
            return;
        }
        message.error("arrayDelectByMatch error");
    }
}
