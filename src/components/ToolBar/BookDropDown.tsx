import { Select } from "antd";

const BOOKS = ["Graduate", "HighSchool", "MiddleSchool", "CET4", "CET6", "SAT", "TOEFL", "生词本"];
export function BookDropDown(props: { book: string; onChange: (value: string) => void }) {
    return (
        <Select
            value={props.book}
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
