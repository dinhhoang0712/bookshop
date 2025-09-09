import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CreateOrderApi } from "services/api";
import { useAppContext } from "components/context/app.context";
import { App } from "antd";

const PaymentRedirect = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setCart } = useAppContext();
    const { message, notification } = App.useApp();

    const pendingOrder = localStorage.getItem("pendingOrder");
    const { type } = pendingOrder ? JSON.parse(pendingOrder) : { type: undefined };

    useEffect(() => {
        const handlePayment = async () => {
            const savedOrder = localStorage.getItem("pendingOrder");
            if (!savedOrder) {
                notification.error({
                    message: "Không tìm thấy thông tin đơn hàng"
                });
                navigate("/order?step=1");
                return;
            }

            const { fullName: name, phone, address, type, totalPrice, detail } = JSON.parse(savedOrder);

            try {
                const res = await CreateOrderApi({ name, phone, address, type, totalPrice, detail });

                if (res) {
                    // Xóa giỏ hàng và đơn hàng đang chờ
                    localStorage.removeItem("cart");
                    localStorage.removeItem("pendingOrder");
                    setCart([]);

                    // Hiển thị thông báo thành công
                    message.success("Đặt hàng thành công");

                    // Chuyển hướng về trang kết quả
                    navigate("/order?step=2");
                } else {
                    throw new Error("Đặt hàng thất bại");
                }
            } catch (error) {
                notification.error({
                    message: "Đặt hàng thất bại",
                    description: "Vui lòng thử lại sau"
                });
                navigate("/order?step=1");
            }
        };

        // Xử lý kết quả thanh toán VNPAY
        if (type === "VNPAY") {
            const vnpResponseCode = searchParams.get("vnp_ResponseCode");
            if (vnpResponseCode === "00") {
                // Thanh toán VNPAY thành công
                handlePayment();
            } else {
                // Thanh toán VNPAY thất bại
                notification.error({
                    message: "Thanh toán thất bại",
                    description: "Vui lòng thử lại sau"
                });
                navigate("/order?step=1");
            }
        }
    }, [searchParams, type]);

    return <></>;
};

export default PaymentRedirect;