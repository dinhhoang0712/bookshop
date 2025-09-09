import { DeleteTwoTone } from "@ant-design/icons";
import { App, Button, Col, Divider, Form, Input, Radio, Row, Space, type FormProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useAppContext } from "components/context/app.context";
import { useEffect, useState } from "react";
import { createdVNPayUrl, CreateOrderApi } from "services/api";

type UserMethod = "COD" | "VNPAY"

interface FileldType {
    fullName: string;
    phone: string;
    address: string;
    type: UserMethod;
}

const Payment = ({ setCurrentStep }: { setCurrentStep: (step: number) => void }) => {
    const { cart, setCart, user } = useAppContext();
    const { message, notification } = App.useApp();
    const [totalPrice, setTotalPrice] = useState(0);
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.fullName,
                phone: user.phone,
                type: "COD",
            });
        }
    }, [user]);

    useEffect(() => {
        if (cart.length > 0) {
            const total = cart.reduce((sum, item) => {
                return sum + item.detail.price * item.quantity;
            }, 0);
            setTotalPrice(total);
        } else {
            setTotalPrice(0);
        }
    }, [cart]);

    const handleDeleteBook = (id: number) => {
        const cartStore = localStorage.getItem("cart");
        if (cartStore) {
            const cartStoreParsed = JSON.parse(cartStore);
            const newCart = cartStoreParsed.filter((c: IBook) => c.id !== id);
            localStorage.setItem("cart", JSON.stringify(newCart));
            setCart(newCart);
        }
    }

    const handlePlaceOrder: FormProps<FileldType>["onFinish"] = async (values) => {
        const { fullName, phone, address, type } = values;
        const detail = cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            bookName: item.detail.mainTest,
        }));
        setIsSubmit(true);
        if (type === 'VNPAY') {
            const amount = totalPrice.toString();

            const res = await createdVNPayUrl({ amount });

            localStorage.setItem(
                "pendingOrder",
                JSON.stringify({ fullName, phone, address, type, totalPrice, detail })
            );
            window.location.href = res;
        } else {
            const res = await CreateOrderApi({
                name: fullName,
                phone,
                address,
                type,
                totalPrice,
                detail,
            });
            if (res) {
                localStorage.removeItem("cart");
                setCart([]);
                setCurrentStep(2);
                message.success("Đặt hàng thành công");
            } else {
                notification.error({
                    message: "Đặt hàng thất bại"
                });
            }
        }

        setIsSubmit(false);
    }

    return (
        <Row gutter={[20, 20]}>
            <Col md={16} xs={24}>
                {cart?.map((item, index) => {
                    const currentBookPrice = item?.detail?.price ?? 0;
                    return (
                        <div className="order-book" key={index}>
                            <div className="book-container">
                                <img src={`${import.meta.env.VITE_API_URL}/image/book/${item?.detail?.thumbnail}`} />
                                <div className="title">{item?.detail?.mainTest}</div>
                                <div className="price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice)}</div>
                            </div>
                            <div className="action">
                                <div className="quantity">
                                    {item.quantity}
                                </div>
                                <div className="total-price">
                                    Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * item?.quantity)}
                                </div>
                                <DeleteTwoTone
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleDeleteBook(item.id)}
                                    twoToneColor="#eb2f96"
                                />
                            </div>

                        </div>
                    )
                })}
                <div>
                    <span style={{ cursor: "pointer" }} onClick={() => setCurrentStep(0)}>
                        Quay trở lại
                    </span>
                </div>
            </Col>
            <Col md={8} xs={24}>
                <Form
                    form={form}
                    autoComplete="off"
                    layout="vertical"
                    requiredMark={false}
                    onFinish={handlePlaceOrder}
                >
                    <div className="order-sum">
                        <Form.Item name="type" label="Phương thức thanh toán">
                            <Radio.Group>
                                <Space direction="vertical">
                                    <Radio value="COD">COD</Radio>
                                    <Radio value="VNPAY">Ví VNPay</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="fullName" label="Họ tên"
                            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="phone" label="Số điện thoại"
                            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="address" label="Địa chỉ nhận hàng"
                            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <div className="calculate">
                            <span>Tạm tính</span>
                            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                        </div>
                        <Divider style={{ margin: "10px 0" }} />
                        <div className="calculate">
                            <span>Tổng tiền</span>
                            <span className="total-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                        </div>
                        <Divider style={{ margin: "10px 0" }} />
                        <Button color="danger" htmlType="submit" variant="solid" loading={isSubmit}>Đặt hàng ({cart.length ?? 0})</Button>
                    </div>
                </Form>
            </Col>

        </Row>
    )

}

export default Payment;
