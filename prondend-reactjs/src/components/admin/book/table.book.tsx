import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components";
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { DeleteBookApi, FetchBookDetailApi, FetchBookTableApi } from "services/api";
import { dateRangeValidate } from "services/helper";
import DetailBook from "./detail.book";
import FormBook from "./form.book";
import { CSVLink } from "react-csv";

interface ISearch {
    mainTest: string;
    author: string;
    createdAt: string;
    rangeCreatedAt: string;
}

const TableBook = () => {
    const actionRef = useRef<ActionType>(null);
    const [meta, setMeta] = useState({
        page: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });
    const { message, notification } = App.useApp();


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [book, setBook] = useState<IBook | null>(null);
    const [mode, setMode] = useState<'create' | 'update'>('create');
    const [openModal, setOpenModal] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [isDelete, setIsDelete] = useState(false);
    const [currentDataTable, setCurrentDataTable] = useState<IBook[]>([]);

    const handleDelete = async (id: number) => {
        setIsDelete(true);
        const res = await DeleteBookApi(id)
        if (res.statusCode === 200) {
            message.success(res.message);
            refreshTable();
        } else {
            notification.error({
                message: 'Xóa sách thất bại',
                description: res.message,
            })
        }
        setIsDelete(false)
    }

    const showModal = async (id: number) => {
        const res = await FetchBookDetailApi(id);
        if (res.data) {
            setBook(res.data);
        }
        setIsModalOpen(true);
    }

    const columns: ProColumns<IBook>[] = [
        {
            dataIndex: 'id',
            title: 'ID',
            hideInSearch: true,
            render: (_: any, entity: IBook) => (
                <Button type="link" onClick={() => showModal(entity.id)}>{entity.id}</Button>
            )
        },
        {
            dataIndex: 'mainTest',
            title: 'Tên sách',
            width: 700
        },
        {
            dataIndex: 'category',
            title: 'Thể loại',
            hideInSearch: true,
        },
        {
            dataIndex: 'author',
            title: 'Tác giả',
            width: 200,
        },
        {
            dataIndex: 'price',
            title: 'Giá',
            hideInSearch: true,
        },
        {
            dataIndex: 'updatedAt',
            valueType: 'date',
            title: 'Thời gian cập nhật',
            sorter: true,
            hideInSearch: true,
            width: 150,
        },
        {
            dataIndex: 'rangeCreatedAt',
            valueType: 'dateRange',
            title: 'Thời gian',
            hideInTable: true,
            colSize: 2,
        },
        {
            dataIndex: 'status',
            title: 'Trạng thái',
            hideInSearch: true,
            width: 100,
            render: (_: any, entity: IBook) => <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                <EditOutlined onClick={() => { setMode('update'); setId(entity.id); setOpenModal(true) }} style={{ color: '#deb916', cursor: 'pointer' }} />
                <Popconfirm
                    placement="leftTop"
                    title="Xóa sách"
                    description="Bạn có chắc chắn muốn xóa sách này không?"
                    onConfirm={() => {
                        handleDelete(entity.id)
                    }}
                    onCancel={() => {
                        setIsDelete(false)

                    }}
                    okText="Có"
                    cancelText="Không"
                    okButtonProps={{ loading: isDelete }}
                >
                    <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                </Popconfirm>
            </div >
        }

    ];

    const refreshTable = () => {
        actionRef.current?.reload();
    }

    return (
        <>
            <ProTable<IBook, ISearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                headerTitle="Quản lý sách"
                toolBarRender={() => [
                    <CSVLink
                        data={currentDataTable}
                        filename={`books-${new Date().toLocaleDateString()}.csv`}
                        target="_blank"
                    >
                        <Button type="primary" key="export" >
                            <ExportOutlined />
                            Export
                        </Button>

                    </CSVLink>
                    ,
                    <Button type="primary" key="add" onClick={() => { setOpenModal(true), setMode('create') }}>
                        <PlusOutlined /> Thêm sách
                    </Button>
                ]}
                request={async (params, sort, filter) => {
            
                    let query = "";
                    if (params) {
                        query += `page=${params.current}&size=${params.pageSize}`;
                        if (params.mainTest) {
                            query += `&mainTest=${params.mainTest}`;
                        }
                        if (params.author) {
                            query += `&author=${params.author}`;
                        }

                        const createdAt = dateRangeValidate(params.rangeCreatedAt);
                        if (createdAt) {
                            query += `&createdAt=/<>/${createdAt[0]},${createdAt[1]}`;
                        }
                    }

                    if (sort && sort.createdAt) {
                        query += `&sort=createdAt,${sort.createdAt === 'ascend' ? 'asc' : 'desc'}`;
                    }
                    const res = await FetchBookTableApi(query);
                    res.data && setMeta(res.data.meta);
                    setCurrentDataTable(res.data?.result || []);
                    return {
                        data: res.data?.result,
                        "page": 1,
                        "success": true,
                        "total": res.data?.meta.total,
                    }
                }}
                rowKey="id"
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} kết quả`,
                }}
            />

            <DetailBook
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                book={book}
                setBook={setBook} />
            <FormBook
                openModal={openModal}
                setOpenModal={setOpenModal}
                refreshTable={refreshTable}
                mode={mode}
                bookId={id}
            />

        </>
    )
}

export default TableBook;