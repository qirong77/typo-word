import { message } from "antd";
import { uniqueArray } from "../utils";

export class DataManager<T> {
    private _storageKey = "TypeWord_";
    public needJsonParse = false;
    constructor(key: string, private _defaultData: T, needJsonParse = false) {
        this.needJsonParse = needJsonParse;
        this._storageKey += key;
        if (!this.getData()) {
            this.saveData(this._defaultData);
        } 
    }
    getData(): T {
        if (!this.needJsonParse) return window.localStorage.getItem(this._storageKey)! as T;
        return JSON.parse(window.localStorage.getItem(this._storageKey)!);
    }
    saveData(newDta: T) {
        if (!this.needJsonParse) return window.localStorage.setItem(this._storageKey, newDta as string);
        localStorage.setItem(this._storageKey, JSON.stringify(newDta));
    }
}

export class DataManagerArray<T> extends DataManager<T[]> {
    constructor(key: string, defaultData: T[]) {
        if (!Array.isArray(defaultData)) {
            throw new Error("defaultData must be array");
        }
        super(key, defaultData, true);
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
    arrayAddItem(item: T, uniquneKey?: keyof T) {
        let oldData = this.getData() as T[];
        if (Array.isArray(oldData)) {
            oldData.push(item);
            if (uniquneKey) {
                oldData = uniqueArray(oldData, uniquneKey);
            }
            this.saveData(oldData);
            return;
        }
        message.error("arrayAdd error");
    }
}

export class DataManagerObject<T> extends DataManager<T> {
    constructor(key: string, defaultData: T) {
        if (typeof defaultData !== "object") {
            throw new Error("defaultData must be object");
        }
        super(key, defaultData, true);
    }
    objectDeleteDataByKey(key: string) {
        const oldData = this.getData() as T;
        // @ts-ignore
        delete oldData[key];
        this.saveData(oldData);
    }
    objectSetProperty(key: keyof T, value: any) {
        const oldData = this.getData() as T;
        // @ts-ignore
        oldData[key] = value;
        console.log(oldData);
        this.saveData(oldData);
    }
}
