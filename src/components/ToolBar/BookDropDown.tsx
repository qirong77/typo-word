import { Button, Dropdown, Select } from "antd";
import { bookDataManager } from "../../data";

const BOOKS = ["Graduate", "HighSchool", "MiddleSchool", "CET4", "CET6", "SAT", "TOEFL", "生词本"];
export function BookDropDown(props: { onChange: (value: string) => void }) {
    return (
        <div>
            <Select
                defaultValue={bookDataManager.getData()}
                style={{ width: 120 }}
                options={BOOKS.map((book) => {
                    return {
                        value: book,
                        label: book,
                    };
                })}
                onChange={props.onChange}
            />
        </div>
    );
}
