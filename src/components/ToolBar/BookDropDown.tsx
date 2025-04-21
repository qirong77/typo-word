import { Select } from "antd";
import { userDataManager } from "../../data";

const BOOKS = ["Graduate", "HighSchool", "MiddleSchool", "CET4", "CET6", "SAT", "TOEFL", "生词本"];
export function BookDropDown(props: { onChange: (value: string) => void }) {
    return (
        <Select
        defaultValue={userDataManager.getData().currentBook}
        style={{ width: 120 }}
        options={BOOKS.map((book) => {
            return {
                value: book,
                label: book,
            };
        })}
        onChange={props.onChange}
    />
    );
}
