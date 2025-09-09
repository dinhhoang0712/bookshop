import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const ResultPage = () => {


    return (
        <Result
            status="success"
            title="Đặt hàng thành công"
            subTitle="Hệ thống đã ghi nhận đơn hàng của bạn"
            extra={[
                <Button key="home">
                    <Link to="/" type="primary">Trang chủ</Link>
                </Button>,
                <Button key="history">
                    <Link to="/history">Lịch sử mua hàng</Link>
                </Button>,
            ]}
        />
    )
}

export default ResultPage;