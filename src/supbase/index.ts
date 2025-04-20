export interface ITableRowWord {
    word: string;
    translations: {
        translation: string;
        type: string;
    }[];
    phrases: {
        phrase: string;
        translation: string;
    };
    phonetic: string; // 音标
    audioUrl: string;
}
export interface ITableRowUser {
    user_name: string;
}
