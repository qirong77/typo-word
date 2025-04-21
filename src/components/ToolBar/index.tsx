import { useState } from "react";
import { BookDropDown } from "./BookDropDown";
import { VocabularyList } from "./VocabularyList";
import { userDataManager } from "../../data";

export const ToolBar = (props: { onChangeBook: (value: string) => void }) => {
    const [book, setBook] = useState(userDataManager.getData().currentBook);
    return (
        <div className=" fixed top-5 right-5  flex gap-2">
            <BookDropDown
                onChange={(value) => {
                    setBook(book);
                    props.onChangeBook(value);
                }}
            />
            <VocabularyList book={book} />
        </div>
    );
};
