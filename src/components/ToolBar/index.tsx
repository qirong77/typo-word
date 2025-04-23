import { BookDropDown } from "./BookDropDown";
import { Settings } from "./Settings";
import { VocabularyList } from "./VocabularyList";

export const ToolBar = (props: { onChangeBook: (value: string) => void; book: string }) => {
    return (
        <div className=" fixed top-5 right-5  flex gap-2">
            <Settings book={props.book} />
        </div>
    );
};
