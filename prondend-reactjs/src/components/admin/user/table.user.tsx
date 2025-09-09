import { CloudUploadOutlined, DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined } from "@ant-design/icons";
import { ProTable, type ActionType, type ProColumns } from "@ant-design/pro-components"
import { App, Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { DeleteUserApi, FetchUserDetailApi, FetchUserTableApi } from "services/api";
import { dateRangeValidate } from "services/helper";
import TableDetail from "./table.detail";
import CreateUser from "./create.user";
import ImportUser from "./data/import.user";
import { CSVLink } from "react-csv";
import UpdateUser from "./update.user";

interface ISearch {
    fullName: string;
    email: string;
    createdAt: string;
    rangeCreatedAt: string;
}


const TableUser = () => {

    const actionRef = useRef<ActionType>(null);
    const [meta, setMeta] = useState({
        page: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });
    const { message, notification } = App.useApp();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAddUser, setIsAddUser] = useState(false);
    const [isImportUser, setIsImportUser] = useState(false);
    const [currentDataTable, setCurrentDataTable] = useState<IUser[]>([]);
    const [isUpdateUser, setIsUpdateUser] = useState(false);
    const [userUpdate, setUserUpdate] = useState<IUserTable | null>(null);
    const [isDeleteUser, setIsDeleteUser] = useState(false);

    const showModal = async (id: number) => {
        setIsModalOpen(true);
        const res = await FetchUserDetailApi(id);
        if (res.data) {
            setUser(res.data);
        }
    }
    const refreshTable = () => {
        actionRef.current?.reload?.();
    }


    const handleDelete = async (id: number) => {
        setIsDeleteUser(true);
        const res = await DeleteUserApi(id)
        if (res.statusCode === 200) {
            message.success(res.message);
            refreshTable();
        } else {
            notification.error({
                message: 'Xóa người dùng thất bại',
                description: res.message,
            })
        }
        setIsDeleteUser(false)
    }

    const columns: ProColumns<IUser>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            align: 'center',
        },
        {
            dataIndex: 'id',
            title: 'ID',
            width: 100,
            hideInSearch: true,
            render: (_: any, entity: IUser) => (
                <Button type="link" onClick={() => showModal(entity.id)}>{entity.id}</Button>
            )
        },
        {
            dataIndex: 'fullName',
            title: 'Họ tên',
        },
        {
            dataIndex: 'email',
            title: 'Email',
            copyable: true,
            ellipsis: true,
        },
        {
            dataIndex: 'rangeCreatedAt',
            valueType: 'dateRange',
            title: 'Thời gian',
            hideInTable: true,
            colSize: 2,
        },
        {
            dataIndex: 'createdAt',
            valueType: 'date',
            title: 'Thời gian tạo',
            sorter: true,
            hideInSearch: true,
            width: 150,
        },
        {
            dataIndex: 'status',
            title: 'Trạng thái',
            hideInSearch: true,
            width: 100,
            render: (_: any, entity: IUserTable) => <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                <EditOutlined onClick={() => {
                    setIsUpdateUser(true)
                    setUserUpdate(entity)
                }} style={{ color: '#deb916', cursor: 'pointer' }} />
                <Popconfirm
                    title="Xóa người dùng"
                    description="Bạn có chắc chắn muốn xóa người dùng này không?"
                    onConfirm={() => {
                        handleDelete(entity.id)
                    }}
                    onCancel={() => {
                        setIsDeleteUser(false)
                    }}
                    okText="Có"
                    cancelText="Không"
                    okButtonProps={{ loading: isDeleteUser }}
                >
                    <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                </Popconfirm>

            </div >
        }


    ];

    return (
        <>
            <ProTable<IUser, ISearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                headerTitle="Quản lý người dùng"
                toolBarRender={() => [
                    <CSVLink
                        data={currentDataTable}
                        filename={`users-${new Date().toLocaleDateString()}.csv`}
                        target="_blank"
                    >
                        <Button type="primary" key="export" >
                            <ExportOutlined />
                            Export
                        </Button>
                    </CSVLink>
                    ,
                    <Button type="primary" key="import" onClick={() => setIsImportUser(true)}>
                        <CloudUploadOutlined /> Import
                    </Button>,
                    <Button type="primary" key="add" onClick={() => setIsAddUser(true)}>
                        <PlusOutlined /> Thêm người dùng
                    </Button>

                ]}
                request={async (params, sort, filter) => {
                   
                    let query = "";
                    if (params) {
                        query += `page=${params.current}&size=${params.pageSize}&sort=createdAt,desc`;
                        if (params.fullName) {
                            query += `&fullName=${params.fullName}`;
                        }
                        if (params.email) {
                            query += `&email=${params.email}`;
                        }

                        const createdAt = dateRangeValidate(params.rangeCreatedAt);
                        if (createdAt) {
                            query += `&createdAt=/<>/${createdAt[0]},${createdAt[1]}`;
                        }
                    }

                    if (sort && sort.createdAt) {
                        query += `&sort=createdAt,${sort.createdAt === 'ascend' ? 'asc' : 'desc'}`;
                    }
                    const res = await FetchUserTableApi(query);
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

            <TableDetail
                user={user}
                setUser={setUser}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />

            <CreateUser
                isAddUser={isAddUser}
                setIsAddUser={setIsAddUser}
                refreshTable={refreshTable}
            />

            <ImportUser
                isImportUser={isImportUser}
                setIsImportUser={setIsImportUser}
                refreshTable={refreshTable}
            />
            <UpdateUser
                isUpdateUser={isUpdateUser}
                setIsUpdateUser={setIsUpdateUser}
                refreshTable={refreshTable}
                userUpdate={userUpdate}
                setUserUpdate={setUserUpdate}
            />
        </>
    )
}

export default TableUser;