import { App, Divider, Form, Input, Modal, type FormProps } from "antd";
import { useEffect, useState } from "react";
import { UpdateUserApi } from "services/api";


type FieldType = {
    id: number;
    fullName: string;
    email: string;
    phone: string;
};

interface IUpdateUser {
    isUpdateUser: boolean;
    setIsUpdateUser: (isUpdateUser: boolean) => void;
    refreshTable: () => void;
    userUpdate: IUserTable | null;
    setUserUpdate: (userUpdate: IUserTable | null) => void;
}
const UpdateUser = (props: IUpdateUser) => {
    const { isUpdateUser, setIsUpdateUser, refreshTable, userUpdate, setUserUpdate } = props;
    const [submit, setSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    useEffect(() => {
        if (userUpdate) {
            form.setFieldsValue(userUpdate);
        }
    }, [userUpdate]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setSubmit(true);
        const { id, fullName, phone } = values;
        const response = await UpdateUserApi({ id, fullName, phone });
        if (response.statusCode === 200) {
            message.success(response.message);
            form.resetFields();
            setUserUpdate(null);
            setIsUpdateUser(false);
            refreshTable();
        } else {
            notification.error({
                message: 'Cập nhật người dùng thất bại',
                description: response.message,
            });
        }

        setSubmit(false);
    };
    return (
        <Modal
            title="Cập nhật người dùng"
            open={isUpdateUser}
            onOk={() => {
                form.submit();
            }}
            onCancel={() => {
                setIsUpdateUser(false);
                setUserUpdate(null);
                form.resetFields();
            }}
            okText="Cập nhật"
            cancelText="Hủy"
            confirmLoading={submit}
        >
            <Divider />
            <Form
                form={form}
                name="basic"
                onFinish={onFinish}
                layout='vertical'
                autoComplete="off"
                style={{ maxWidth: 600 }}
            >
                <Form.Item<FieldType>
                    hidden
                    labelCol={{ span: 24 }}
                    label="Id"
                    name="id"
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input />
                </Form.Item>

            </Form>
        </Modal>
    )
}

export default UpdateUser;