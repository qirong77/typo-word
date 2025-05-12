export class LoadingManager {
    onLoadingChangeHandlers: Function[] = [];
    constructor() {

    }
    registerLoadingChangeHandler(handler: (isLoading: boolean) => void) {
        this.onLoadingChangeHandlers.push(handler);
    }
    unregisterLoadingChangeHandler(handler: Function) {
        this.onLoadingChangeHandlers = this.onLoadingChangeHandlers.filter(h => h !== handler);
    }
    onLoadingChange(isLoading: boolean) {
        this.onLoadingChangeHandlers.forEach(handler => {
            handler(isLoading);
        });
    }
}