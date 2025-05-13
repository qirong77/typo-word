import { useEffect, useState } from "react";
import { historyDataManager, IHistory } from "../../../data";
import { Button, Table, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export function HistoryList() {
    const [historyList, setHistoryList] = useState<IHistory[]>([]);
    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const [pageSize, setPageSize] = useState(5); // 每页显示的条数
    useEffect(() => {
        const data = historyDataManager.getData();
        console.log(data)
        setHistoryList(Object.values(data));
    }, []);

    const handleDelete = (id: number) => {
        historyDataManager.objectDeleteDataByKey(id.toString());
        const data = historyDataManager.getData();
        setHistoryList(Object.values(data));
    };

    const content = (
        <div style={{ width: 500, maxHeight: 360, overflow: "auto" }}>
                <Typography.Text type="secondary">开发中...</Typography.Text>

            {/* {historyList.length > 0 ? (
                <Table
                    scroll={{ x: 'max-content' }}
                    bordered
                    dataSource={historyList}
                    columns={[
                        {
                            title: "Time",
                            dataIndex: "id",
                            key: "id",
                            render(value) {
                                return <span>{new Date(value).toLocaleString()}</span>;
                            },
                        },
                        {
                            title:'单词书',
                            dataIndex:'book',
                            key:'book',
                        },
                        {
                            title: "时间",
                            dataIndex: "timeElapsed",
                            key: "timeElapsed",
                            render(value) {
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
                            render(value) {
                                return <span>{value}%</span>;
                            },
                        },
                        {
                            title: "操作",
                            key: "action",
                            fixed: "right",
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
            )} */}
        </div>
    );

    return content;
}