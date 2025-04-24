import { BookOutlined, DeleteOutlined, HistoryOutlined, RocketOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Menu, Popover, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { VocabularyList } from "./VocabularyList";
import { historyDataManager, IHistory } from "../../data";

export function Settings({ book }: { book: string }) {
    const [visible, setVisible] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState(["单词书"]);
    const content = (
        <div className="flex gap-5" style={{
            width: "680px",
            height: "380px"
        }}>
            <Menu
                selectedKeys={selectedKeys}
                onClick={({key}) => {
                    setSelectedKeys([key]);
                }}
                items={[
                    { key: "单词书", label: "单词书", icon: <BookOutlined /> },
                    { key: "快捷键", label: "快捷键", icon: <RocketOutlined /> },
                    { key: "历史记录", label: "历史记录", icon: <HistoryOutlined /> },
                ]}
            />
            <div style={{
                // margin:10
            }}>
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

function HistoryList() {
    const [historyList, setHistoryList] = useState<IHistory[]>([]);
    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const [pageSize, setPageSize] = useState(5); // 每页显示的条数

    useEffect(() => {
        const data = historyDataManager.getData();
        setHistoryList(Object.values(data));
    }, []);

    const handleDelete = (id: number) => {
        historyDataManager.objectDeleteDataByKey(id.toString());
    };

    const content = (
        <div style={{ width: 500, maxHeight: 360, overflow: "auto" }}>
            {historyList.length > 0 ? (
                <Table
                    bordered
                    dataSource={historyList}
                    columns={[
                        {
                            title: "Time",
                            dataIndex: "id",
                            key: "id",
                            render(value, record, index) {
                                return <span>{new Date(value).toLocaleString()}</span>;
                            },
                        },
                        {
                            title: "时间",
                            dataIndex: "timeElapsed",
                            key: "timeElapsed",
                            render(value, record, index) {
                                return <span>{value}</span>;
                            },
                        },
                        {
                            title: "单词数",
                            dataIndex: "wordCount",
                            key: "wordCount",
                        },
                        {
                            title: "输入数",
                            dataIndex: "count",
                            key: "count",
                        },
                        {
                            title: "正确数",
                            dataIndex: "count",
                            key: "count",
                        },
                        {
                            title: "正确率",
                            dataIndex: "accuracy",
                            key: "accuracy",
                            render(value, record, index) {
                                return <span>{value}</span>;
                            },
                        },
                        {
                            title: "操作",
                            key: "action",
                            render: (_: any, record: IHistory) => (
                                <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger>
                                    删除
                                </Button>
                            ),
                        },
                    ]}
                    rowKey="word"
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: historyList.length,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        },
                    }}
                    size="small"
                />
            ) : (
                <Typography.Text type="secondary">暂无数据</Typography.Text>
            )}
        </div>
    );

    return content;
}
