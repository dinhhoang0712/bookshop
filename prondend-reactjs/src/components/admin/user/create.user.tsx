import { App, Divider, Form, Input, Modal, type FormProps } from "antd";
import { useState } from "react";

import { CreateUserApi } from "services/api";

interface ICreateUser {
    isAddUser: boolean;
    setIsAddUser: (isAddUser: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    fullName: string;
    email: string;
    phone: string;
    password: string;
};


const CreateUser = (props: ICreateUser) => {
    const { isAddUser, setIsAddUser, refreshTable } = props;
    const [submit, setSubmit] = useState(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setSubmit(true);
        const { fullName, email, password, phone } = values;
        const response = await CreateUserApi({ fullName, email, password, phone });
        if (response.statusCode === 201) {
            message.success(response.message);
            form.resetFields();
            setIsAddUser(false);
            refreshTable();
        } else {
            notification.error({
                message: 'Thêm người dùng thất bại',
                description: response.message,
            });
        }

        setSubmit(false);
    };

    return (
        <Modal
            title="Thêm người dùng"
            open={isAddUser}
            onOk={() => {
                form.submit();
            }}
            onCancel={() => {
                setIsAddUser(false);
                form.resetFields();
            }}
            okText="Tạo mới"
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
                    labelCol={{ span: 24 }}
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    labelCol={{ span: 24 }}
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                    <Input.Password />
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

export default CreateUser;