export class DataManager<T> {
    private _storageKey = "TypeWord_";
    constructor(key: string, private _defaultData: T) {
        this._storageKey += key;
        if (!this.getData()) {
            this.saveData(this._defaultData);
        }
    }
    getData(): T {
        return JSON.parse(window.localStorage.getItem(this._storageKey)!);
    }
    saveData(newDta: T) {
        localStorage.setItem(this._storageKey, JSON.stringify(newDta));
    }
}
