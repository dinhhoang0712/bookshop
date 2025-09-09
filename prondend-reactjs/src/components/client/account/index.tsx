import { Modal, Tabs } from "antd";
import UserInfo from "./user.info";
import UserPassword from "./change.password";


interface ManageAccountProps {
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
}

const ManageAccount = ({ isModalOpen, setIsModalOpen }: ManageAccountProps) => {

    const items = [
        {
            key: "info",
            label: "Thông tin tài khoản",
            children: <UserInfo />
        },
        {
            key: "password",
            label: "Đổi mật khẩu",
            children: <UserPassword />
        }
    ]

    return (
        <Modal
            title="Quản lý tài khoản"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
        >
            <Tabs
                defaultActiveKey="info"
                items={items} />
        </Modal>
    )
}

export default ManageAccount;
