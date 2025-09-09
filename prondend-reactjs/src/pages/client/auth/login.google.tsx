import { App } from "antd";
import { useAppContext } from "components/context/app.context";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginGoogle = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useAppContext();
    const { message, notification } = App.useApp();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const userData = searchParams.get('user');

        if (accessToken) {
            // Store access token
            localStorage.setItem('accessToken', accessToken);

            // Parse and store user data if available
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    setUser(user);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }

            // Show success message
            message.success('Đăng nhập thành công');

            // Redirect to home page or dashboard
            navigate('/');
        } else {
            message.error('Login failed. Please try again.');
            navigate('/login');
        }
    }, [searchParams, setUser, message, navigate]);

    return <></>
}

export default LoginGoogle;