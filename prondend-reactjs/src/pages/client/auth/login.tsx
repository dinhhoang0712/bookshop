import { App, Button, Divider, Form, type FormProps, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginApi } from "services/api";
import 'pages/client/auth/auth.model.scss';
import { CloseCircleOutlined, GooglePlusOutlined } from "@ant-design/icons";
import { useAppContext } from "components/context/app.context";

type FieldType = {
    email: string;
    password: string;
}

const LoginPage = () => {

    const { message, notification } = App.useApp();
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser, isLoading, setIsLoading } = useAppContext();


    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsLoading(true);
        const { email, password } = values;
        const response = await LoginApi(email, password);
        if (response.data) {
            localStorage.setItem('access_token', response.data.accessToken);
            setIsAuthenticated(true);
            setUser(response.data.user as IUser);
            message.success(response.message);
            navigate('/');
        } else {
            notification.info({
                message: 'Có lỗi xảy ra',
                description: response.message,
                placement: 'topRight',
                icon: <CloseCircleOutlined style={{ color: 'red' }} />
            });
        }
        setIsLoading(false);
    };

    const handleLoginGoogle = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/authorize`

    }
    return (
        <>
            <div className="wrapper">
                <div className="container">
                    <h1>Đăng nhập tài khoản</h1>
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

                            <Form.Item>
                                <Button type="primary" htmlType="submit"
                                    loading={isLoading}
                                >
                                    Đăng nhập
                                </Button>
                            </Form.Item>

                            <Divider>Hoặc</Divider>
                            <Button type="primary" onClick={() => handleLoginGoogle()}>Đăng nhập với google <GooglePlusOutlined style={{ color: "orange" }} /> </Button>
                            <div className="social-container">
                                <span>Bạn chưa có tài khoản?</span>
                                <Link to="/register">Đăng ký</Link>
                            </div>
                        </Form>
                    </div>
                    <Divider />
                    <Link to="/reset-password">Quên mật khẩu</Link>
                </div>
            </div>
        </>
    )
}

export default LoginPage;