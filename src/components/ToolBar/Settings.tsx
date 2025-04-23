import { SettingOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { useState } from "react";

export function Settings() {
    const [visible, setVisible] = useState(false);

    const content = <div>开发中...</div>;
    return (
        <Popover content={content} title={"设置"} trigger="click" open={visible} onOpenChange={setVisible} placement="bottomRight" arrow={true}>
            <Button icon={<SettingOutlined />}>设置</Button>
        </Popover>
    );
}
