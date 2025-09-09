import type { FormProps } from 'antd';
import { App, Button, Divider, Form, Input, Modal } from 'antd';
import 'pages/client/auth/auth.model.scss';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterApi } from 'services/api';

type FieldType = {
    fullName: string;
    email: string;
    phone: string;
    password: string;
};

const RegisterPage = () => {

    const { message } = App.useApp();
    const navigate = useNavigate();
    const [isVerify, setVerify] = useState(false);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, email, password, phone } = values;
        const response = await RegisterApi({ fullName, email, password, phone });
        if (response.statusCode === 201) {
            message.success(response.message);
            setVerify(true);
        } else {
            message.error(response.message);
        }
    };


    return (
        <>
            <div className="wrapper">
                <div className="container">
                    <h1>Đăng ký tài khoản</h1>
                    <Divider />
                    <div className="form-container">
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            layout='vertical'
                            autoComplete="off"
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

                            <Form.Item label={null}>
                                <Button type="primary" htmlType="submit">
                                    Đăng ký
                                </Button>
                            </Form.Item>
                        </Form>

                        <Divider>Or</Divider>
                        <div className="social-container">
                            <span>Bạn có tài khoản?</span>
                            <Link to="/login">Đăng nhập</Link>
                        </div>
                    </div>

                </div>
            </div>

            <Modal
                open={isVerify}
                footer={[
                    <Button
                        key="login"
                        type="primary"
                        size="large"
                        style={{ borderRadius: 6, minWidth: 120 }}
                        onClick={() => {
                            setVerify(false);
                            navigate('/login');
                        }}
                    >
                        Đăng nhập
                    </Button>
                ]}
                closable={false}
                onCancel={() => setVerify(false)}
                centered
                style={{
                    textAlign: 'center',
                    padding: '32px 24px'
                }}
            >
                <img
                    src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                    alt="Email Verification"
                    style={{ width: 64, marginBottom: 16 }}
                />
                <h2 style={{ marginBottom: 8, color: '#1677ff' }}>Xác thực email</h2>
                <p style={{ fontSize: 16, color: '#555', marginBottom: 0 }}>
                    Vui lòng kiểm tra hộp thư <b>Gmail</b> của bạn để xác thực tài khoản trước khi đăng nhập.
                </p>
            </Modal>
        </>
    )
}

export default RegisterPage;