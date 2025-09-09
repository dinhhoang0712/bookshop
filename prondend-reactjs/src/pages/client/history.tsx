import { App, Divider, Drawer, Image, Table, Tag, type TableProps } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FetchHistoryApi } from "services/api";


const HistoryPage = () => {
    const colums: TableProps<IHistory>['columns'] = [
        {
            title: "STT",
            dataIndex: "index",
            key: "name",
            render: (_, __, index) => index + 1
        },
        {
            title: "Thời gian",
            dataIndex: "createdAt",
            render: (value) => dayjs(value).format("DD/MM/YYYY")
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
        },
        {
            title: "Trạng thái",
            render: () => (
                <Tag color={"green"}>
                    Thành công
                </Tag>
            )
        },
        {
            title: "Chi tiết",
            key: "action",
            render: (_, record) => (
                <a onClick={() => {
                    setIsModalOpen(true);
                    setDataDetail(record);
                }}>
                    Xem chi tiết
                </a>
            )
        }
    ]

    const columnsDetail = [
        {
            title: "Ảnh",
            dataIndex: "img",
            key: "img",
            render: (value: string) => <Image src={value} width={100} height={100} />
        },
        {
            title: "Tên sách",
            dataIndex: "bookName",
            key: "bookName",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        }
    ]


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dataDetail, setDataDetail] = useState<IHistory | null>(null);

    const [dataHistory, setDataHistory] = useState<IHistory[]>([]);
    const [loading, setLoading] = useState(false);

    const { notification } = App.useApp()

    const dataSourceDetail: any = dataDetail?.orderDetails?.map((item: any, index: number) => ({
        key: index,
        img: `${import.meta.env.VITE_API_URL}/image/book/${item.img}`,
        bookName: item.bookName,
        quantity: item.quantity,
    }))

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await FetchHistoryApi();
            if (res.data) {
                setDataHistory(res.data);
            } else {
                notification.error({
                    message: "Đã xảy ra lỗi",
                    description: res.message
                })
            }
            setLoading(false);
        }
        fetchData();
    }, [])
    return (
        <div style={{ margin: 50 }}>
            <div>Lịch sử mua hàng</div>
            <Divider />
            <Table
                bordered
                columns={colums}
                dataSource={dataHistory}
                loading={loading}
                rowKey={(record) => record.id}
            />
            <Drawer
                width={700}
                title="Chi tiết đơn hàng"
                open={isModalOpen}
                onClose={() => { setIsModalOpen(false); setDataDetail(null) }}
            >
                <Table
                    columns={columnsDetail}
                    dataSource={dataSourceDetail}
                />
            </Drawer>
        </div>
    )
}

export default HistoryPage;
