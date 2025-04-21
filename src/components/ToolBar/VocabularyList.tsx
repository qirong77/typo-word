import { BookOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Popover, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { IUnfamiliarWords, unFamiliarWordsDataManager } from "../../data";

export const VocabularyList = () => {
    const [visible, setVisible] = useState(false);
    const [vocabularyList, setVocabularyList] = useState<IUnfamiliarWords[]>([]);

    useEffect(() => {
        if(!visible) return
        // 加载生词列表数据
        const data = unFamiliarWordsDataManager.getData();
        setVocabularyList(data);
    }, [visible]);

    // 删除单词
    const handleDelete = (word: string) => {
        const newList = vocabularyList.filter((item) => item.word !== word);
        setVocabularyList(newList);
        unFamiliarWordsDataManager.saveData(newList);
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
        <div style={{ width: 500, maxHeight: 400, overflow: "auto" }}>
            {vocabularyList.length > 0 ? (
                <Table bordered dataSource={vocabularyList} columns={columns} rowKey="word" pagination={false} size="small" />
            ) : (
                <Typography.Text type="secondary">暂无生词</Typography.Text>
            )}
        </div>
    );

    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 1000,
            }}
        >
            <Popover content={content} title="生词本" trigger="click" open={visible} onOpenChange={setVisible} placement="bottomRight" arrow={true}>
                <Button type="primary" shape="circle" icon={<BookOutlined />} size="large" />
            </Popover>
        </div>
    );
};
