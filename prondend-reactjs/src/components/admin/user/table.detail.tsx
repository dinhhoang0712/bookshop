import { UserOutlined } from "@ant-design/icons";
import { Avatar, Descriptions, Drawer } from "antd";

interface ITableDetail {
    user: IUser | null;
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
    setUser: (user: IUser | null) => void;
}

const TableDetail = (props: ITableDetail) => {


    const { user, isModalOpen, setIsModalOpen, setUser } = props;

    const handleClose = () => {
        setIsModalOpen(false);
        setUser(null);
    }

    const avatar = `${import.meta.env.VITE_API_URL}/image/avatar/${user?.avatar}`
    return (
        <Drawer
            width={"50vx"}
            title="Chức năng xem chi tiết"
            closable={{ 'aria-label': 'Close Button' }}
            onClose={handleClose}
            open={isModalOpen}
        >
            <Descriptions title="Thông tin người dùng"
                bordered
                column={2}
            >
                <Descriptions.Item label="Id">{user?.id}</Descriptions.Item>
                <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
                <Descriptions.Item label="Role">{user?.role}</Descriptions.Item>
                <Descriptions.Item label="Avatar">
                    {user?.avatar ? <Avatar src={avatar} /> : <Avatar icon={<UserOutlined />} />}
                </Descriptions.Item>
                <Descriptions.Item label="Họ tên">{user?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{user?.phone}</Descriptions.Item>
                <Descriptions.Item label="Thời gian tạo">{user?.createdAt && new Date(user.createdAt).toLocaleDateString()}</Descriptions.Item>
                <Descriptions.Item label="Thời gian cập nhật">{user?.updatedAt && new Date(user.updatedAt).toLocaleDateString()}</Descriptions.Item>
            </Descriptions>;
        </Drawer>
    )
}

export default TableDetail;