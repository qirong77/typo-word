export interface IWordInfo {
    word:string,
    translations:{
        translation:string,
        type:string
    }[],
    phrases:{
        phrase:string,
        translation:string
    }[]
}