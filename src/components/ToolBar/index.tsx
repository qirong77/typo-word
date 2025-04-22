import { BookDropDown } from "./BookDropDown";
import { VocabularyList } from "./VocabularyList";

export const ToolBar = (props: { onChangeBook: (value: string) => void; book: string }) => {
    return (
        <div className=" fixed top-5 right-5  flex gap-2">
            <BookDropDown
                book={props.book}
                onChange={(value) => {
                    props.onChangeBook(value);
                }}
            />
            <VocabularyList book={props.book} />
        </div>
    );
};
