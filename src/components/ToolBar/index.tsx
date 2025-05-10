import { Select } from "antd";
import { Settings } from "../Settings";
import { E_BOOKS } from "../../books/E_BOOKS";
import { TypeWordEvent } from "../../event/TypeWordEvent";

export const ToolBar = (props: { book: string }) => {
    return (
        <div className=" fixed top-5 right-5  flex gap-2">
            <Select
                options={Object.values(E_BOOKS).map((book) => {
                    return {
                        value: book,
                        label: book,
                    };
                })}
                value={props.book}
                onChange={(value) => {
                    TypeWordEvent.dispatchEvent("book-change", value);
                }}
            />
            <Settings book={props.book} />
        </div>
    );
};
