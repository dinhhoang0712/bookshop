import { Button, Result } from "antd";
import { useAppContext } from "components/context/app.context";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

interface IProps {
    children: React.ReactNode;
}

const ProtectedRoute = (props: IProps) => {

    const { isAuthenticated, user } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    if (!isAuthenticated) {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Người dùng chưa đăng nhập"
                extra={<Button type="primary" onClick={() => navigate('/login')}>Quay lại đăng nhập</Button>}
            />
        );
    }

    if (location.pathname === '/admin' && user?.role !== 'ADMIN') {
        return (
            <Result
                status="403"
                title="403"
                subTitle="Người dùng không có quyền truy cập"
                extra={<Button type="primary" onClick={() => navigate('/')}>Quay lại trang chủ</Button>}
            />
        );
    }
    return (
        <>
            {props.children}
        </>
    )

}

export default ProtectedRoute;

