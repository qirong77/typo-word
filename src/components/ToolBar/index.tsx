import { BookDropDown } from "./BookDropDown";
import { VocabularyList } from "./VocabularyList";

export const ToolBar = (props: { onChangeBook: (value: string) => void }) => {
    return (
        <div className=" fixed top-5 right-5 ">
            <BookDropDown
                onChange={(value) => {
                    props.onChangeBook(value);
                }}
            />
            {/* <VocabularyList /> */}
        </div>
    );
};
