import {  DeleteOutlined } from "@ant-design/icons";
import { Button , Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { IUnfamiliarWords, unFamiliarWordsDataManager } from "../../data";
import { getBookWords } from "../../books/getBookWords";

export const VocabularyList = (props: { book: string }) => {
    const [vocabularyList, setVocabularyList] = useState<{ word: string; means: string[] }[]>([]);
    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const [pageSize, setPageSize] = useState(5); // 每页显示的条数

    useEffect(() => {
        // 加载生词列表数据
        const data = getBookWords(props.book);
        setVocabularyList(
            data.map((item) => ({
                word: item,
                means: [],
            }))
        );
    }, []);

    // 删除单词
    const handleDelete = (word: string) => {
        unFamiliarWordsDataManager.arrayDelectByMatch("word", word);
        setVocabularyList(unFamiliarWordsDataManager.getData());
    };

    const columns = [
        {
            title: "单词",
            dataIndex: "word",
            key: "word",
        },
        {
            title: "中文意思",
            dataIndex: "means",
            key: "means",
            render: (means: string[]) => means.join("、"),
        },
        {
            title: "操作",
            key: "action",
            render: (_: any, record: IUnfamiliarWords) => (
                <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(record.word)} danger>
                    删除
                </Button>
            ),
        },
    ];

    const content = (
        <div style={{ width: 500, maxHeight: 360, overflow: "auto" }}>
            {vocabularyList.length > 0 ? (
                <Table
                    bordered
                    dataSource={vocabularyList}
                    columns={columns}
                    rowKey="word"
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: vocabularyList.length,
                        onChange: (page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        },
                    }}
                    size="small"
                />
            ) : (
                <Typography.Text type="secondary">暂无生词</Typography.Text>
            )}
        </div>
    );

    return content
};