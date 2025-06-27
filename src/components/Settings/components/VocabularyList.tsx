import { DeleteOutlined } from "@ant-design/icons";
import { Button, Checkbox, Radio, Select, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { IUnfamiliarWords, unFamiliarWordsDataManager } from "../../../data";
import { getBookWords } from "../../../books/getBookWords";
import { TypeWordEvent } from "../../../event/TypeWordEvent";
import { E_BOOKS } from "../../../books/E_BOOKS";
import { getWordInfo } from "../../../WordGroupManager/getWordInfo";

export const VocabularyList = (props: { book: string }) => {
    const [vocabularyList, setVocabularyList] = useState<{ word: string; means: string[] }[]>([]);
    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const [pageSize, setPageSize] = useState(5); // 每页显示的条数
    const [showChinese, setShowChinese] = useState(false);
    useEffect(() => {
        // 加载生词列表数据
        const data = getBookWords(props.book);
        Promise.all(data.map((item) => getWordInfo(item))).then((words) => {
            setVocabularyList(words);
        });
    }, [props.book]);

    // 删除单词
    const handleDelete = (word: string) => {
        unFamiliarWordsDataManager.arrayDelectByMatch("word", word);
        setVocabularyList(unFamiliarWordsDataManager.getData());
    };
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.shiftKey) {
                e.preventDefault();
                setShowChinese((v) => !v);
                return;
            }
            if (e.code === "ArrowLeft") {
                setCurrentPage((v) => v - 1);
            }
            if (e.code === "ArrowRight") {
                setCurrentPage((v) => v + 1);
            }
        };
        document.addEventListener("keydown", handler);
        return () => {
            document.removeEventListener("keydown", handler);
        };
    }, []);

    const content = (
        <div>
            <div style={{ marginBottom: 10 }}>
                <Select
                    options={Object.values(E_BOOKS).map((book) => {
                        return {
                            value: book,
                            label: book,
                        };
                    })}
                    value={props.book}
                    onChange={(value) => {
                        TypeWordEvent.dispatchEvent("book-change", value);
                    }}
                />
            </div>
            {vocabularyList.length > 0 ? (
                <Table
                    bordered
                    dataSource={vocabularyList}
                    columns={[
                        {
                            title: "单词",
                            dataIndex: "word",
                            key: "word",
                            width: 100,
                        },
                        {
                            title: (
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span>释义</span>
                                    <Checkbox
                                        checked={showChinese}
                                        onChange={(e) => {
                                            setShowChinese(e.target.checked);
                                        }}
                                    />
                                </div>
                            ),
                            dataIndex: "means",
                            key: "means",
                            width:500,
                            render: (value: string[]) => {
                                if (!showChinese) return "-";
                                return value.join(",");
                            },
                        },
                        {
                            title: "操作",
                            key: "action",
                            width: 100,
                            render: (_: any, record: IUnfamiliarWords) => (
                                <Button
                                    type="text"
                                    disabled={![E_BOOKS.生词本, E_BOOKS.熟悉本].includes(props.book)}
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDelete(record.word)}
                                    danger
                                >
                                    删除
                                </Button>
                            ),
                        },
                    ]}
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

    return content;
};
