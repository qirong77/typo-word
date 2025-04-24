import { BookOutlined , HistoryOutlined, RocketOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Menu, Popover,  } from "antd";
import {  useState } from "react";
import { VocabularyList } from "./components/VocabularyList";
import { HistoryList } from "./components/HistoryList";

export function Settings({ book }: { book: string }) {
    const [visible, setVisible] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState(["单词书"]);
    const content = (
        <div
            className="flex gap-5"
            style={{
                width: "680px",
                height: "380px",
            }}
        >
            <Menu
                selectedKeys={selectedKeys}
                onClick={({ key }) => {
                    setSelectedKeys([key]);
                }}
                items={[
                    { key: "单词书", label: "单词书", icon: <BookOutlined /> },
                    { key: "快捷键", label: "快捷键", icon: <RocketOutlined /> },
                    { key: "历史记录", label: "历史记录", icon: <HistoryOutlined /> },
                ]}
            />
            <div>
                <MenuItem label={selectedKeys[0]} book={book} />
            </div>
        </div>
    );
    return (
        <Popover content={content} title={"设置"} trigger="click" open={visible} onOpenChange={setVisible} placement="bottomRight" arrow={true}>
            <Button icon={<SettingOutlined />}>设置</Button>
        </Popover>
    );
}

function MenuItem(props: { label: string; book: string }) {
    if (props.label === "单词书") {
        return (
            <div>
                <VocabularyList book={props.book} />
            </div>
        );
    }
    if (props.label === "快捷键") {
        return <div>开发中...</div>;
    }
    if (props.label === "历史记录") {
        return (
            <div>
                <HistoryList />
            </div>
        );
    }
}
