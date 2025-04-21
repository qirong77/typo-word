import { Button, Dropdown, Select } from "antd";

const BOOKS = ["Graduate", "HighSchool", "MiddleSchool", "CET4", "CET6", "SAT", "TOEFL", "生词本"];
export function BookDropDown(props: { onChange: (value: string) => void }) {
    return (
        <div>
            <Select
                defaultValue="Graduate"
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
