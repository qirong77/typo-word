import { Table } from "antd";
import { useState } from "react";

export function HotKeyList() {
    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const [pageSize, setPageSize] = useState(5); // 每页显示的条数
    const content = (
        <div style={{ width: 500, maxHeight: 360, overflow: "auto" }}>
            <Table
                scroll={{ x: "max-content" }}
                bordered
                dataSource={[
                    {
                        fn: "下一个",
                        keys: "空格键",
                    },
                    {
                        fn: "加入生词本",
                        keys: "+",
                    },
                    {
                        fn: "加入熟悉本",
                        keys: "-",
                    },
                    {
                        fn: "显示词义",
                        keys: "Tab",
                    },
                    {
                        fn: "播放声音",
                        keys: "`",
                    },
                ]}
                columns={[
                    {
                        title: "功能",
                        dataIndex: "fn",
                        key: "fn",
                    },
                    {
                        title: "快捷键",
                        dataIndex: "keys",
                        key: "keys",
                    },
                ]}
                rowKey="word"
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    },
                }}
                size="small"
            />
        </div>
    );

    return content;
}
