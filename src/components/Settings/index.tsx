import { BookOutlined, HistoryOutlined, RocketOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Menu, Popover } from "antd";
import { useEffect, useState } from "react";
import { VocabularyList } from "./components/VocabularyList";
import { HistoryList } from "./components/HistoryList";
import { HotKeyList } from "./components/HotKeyList";
import { VolumeControl } from "./components/VolumeControl";
import { TypeWordEvent } from "../../event/TypeWordEvent";


export function Settings({ book }: { book: string }) {
    const [visible, setVisible] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState(["单词书"]);
    const content = (
        <div
            className="flex gap-5"
            style={{
                width: "800px",
                height: "480px",
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
                    { key: "其他设置", label: "其他设置", icon: <SettingOutlined /> },
                ]}
            />
            <div>
                <MenuItem label={selectedKeys[0]} book={book} />
            </div>
        </div>
    );
    useEffect(() => {
        TypeWordEvent.dispatchEvent("setting-visible-change", visible)
    },[visible])
    return (
        <Popover
            destroyTooltipOnHide
            content={content}
            title={"设置"}
            trigger="click"
            open={visible}
            onOpenChange={setVisible}
            placement="bottomRight"
            arrow={true}
        >
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
        return (
            <div>
                <HotKeyList />
            </div>
        );
    }
    if (props.label === "历史记录") {
        return (
            <div>
                <HistoryList />
            </div>
        );
    }
    if (props.label === "其他设置") {
        return (
            <div>
                <VolumeControl />
            </div>
        );
    }
}
