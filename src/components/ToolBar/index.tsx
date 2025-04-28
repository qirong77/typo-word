import { Settings } from "../Settings";


export const ToolBar = (props: { book: string }) => {
    return (
        <div className=" fixed top-5 right-5  flex gap-2">
            <Settings book={props.book} />
        </div>
    );
};
