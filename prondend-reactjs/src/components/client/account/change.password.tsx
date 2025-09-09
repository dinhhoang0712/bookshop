import { App, Button, Col, Form, Input, Row, type FormProps } from "antd";
import { useState } from "react";
import { updateUserPasswordApi } from "services/api";

type FieldType = {
    currentPassword: string;
    newPassword: string;
}
const UserPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { currentPassword, newPassword } = values;
        setIsLoading(true);

        const res = await updateUserPasswordApi({ currentPassword, newPassword });
        if (res.statusCode === 200) {
            message.success("Cập nhật mật khẩu thành công");
            form.setFieldValue("currentPassword", "")
            form.setFieldValue("newPassword", "")
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }

        setIsLoading(false)
    }

    return (
        <div style={{ minHeight: 400 }}>
            <Row>
                <Col span={1}></Col>
                <Col span={12}>
                    <Form
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                    >
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Mật khẩu hiển thị"
                            name="currentPassword"
                            rules={[{ required: true, message: 'Không được bỏ trống' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Mật khẩu mới"
                            name="newPassword"
                            rules={[{ required: true, message: 'Không được bỏ trống' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Button htmlType="submit" color="primary" variant="solid" loading={isLoading}>Xác nhận</Button>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default UserPassword;