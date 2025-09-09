import { DeleteTwoTone } from "@ant-design/icons";
import { App, Col, Divider, InputNumber, Row } from "antd";
import { useAppContext } from "components/context/app.context";
import { useEffect, useState } from "react";
import "styles/order.scss"

const OrderDetail = ({ setCurrentStep }: { setCurrentStep: (step: number) => void }) => {
    const { message } = App.useApp();
    const { cart, setCart } = useAppContext();
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (cart.length > 0 && cart) {
            const total = cart.reduce((sum, item) => {
                return sum + item.detail.price * item.quantity;
            }, 0);
            setTotalPrice(total);
        } else {
            setTotalPrice(0);
        }
    }, [cart]);

    const handleChangeQuantity = (value: number, book: IBook) => {
        if (!value || value < 1) return;
        if (!isNaN(+value)) {
            const cartStore = localStorage.getItem("cart");
            if (cartStore && book) {
                let isExistIndex = cart.findIndex(c => c.id === book.id);
                if (isExistIndex !== -1) {
                    const updatedCart = [...cart];
                    updatedCart[isExistIndex] = {
                        ...updatedCart[isExistIndex],
                        quantity: +value,
                    };
                    localStorage.setItem("cart", JSON.stringify(updatedCart));
                    setCart(updatedCart);
                }
            }
        }
    }

    const handleDeleteBook = (id: number) => {
        const cartStore = localStorage.getItem("cart");
        if (cartStore) {
            const cartStoreParsed = JSON.parse(cartStore);
            const newCart = cartStoreParsed.filter((c: IBook) => c.id !== id);
            localStorage.setItem("cart", JSON.stringify(newCart));
            setCart(newCart);
        }
    }

    const handleNextStep = () => {
        if (!cart.length) {
            message.error("Vui lòng chọn sản phẩm");
            return;
        }
        setCurrentStep(1);
    }
    return (
        <>
            <div style={{ backgroundColor: '#efefef', padding: "20px 0" }} >
                <div className="order-container" style={{ maxWidth: "1400px", margin: "0 auto" }} >
                    <Row gutter={[20, 20]}>
                        <Col md={18} xs={24} >
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
                                                <InputNumber
                                                    onChange={(value) => handleChangeQuantity(value as number, item.detail)}
                                                    value={item.quantity}
                                                />
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
                        </Col>

                        <Col md={6} xs={24} >
                            <div className="order-sum">
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
                                <button onClick={handleNextStep}>Mua hàng ({cart.length ?? 0})</button>

                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default OrderDetail;