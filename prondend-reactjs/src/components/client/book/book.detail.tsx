import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, Divider, Rate, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import ImageGallery from "react-image-gallery";
import ModalGallery from "./modal.gallery";
import "styles/book.scss"
import { useAppContext } from "components/context/app.context";
import { Navigate, useNavigate } from "react-router-dom";

const BookDetail = (props: { book: IBook }) => {
    const { book } = props;

    const { message } = App.useApp();
    const [imageGallery, setImageGallery] = useState<{
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[]>([]);

    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { setCart, user } = useAppContext();
    const navigate = useNavigate();

    const refGallery = useRef<ImageGallery>(null);


    useEffect(() => {
        if (book) {
            const images = [];
            if (book.thumbnail) {
                images.push({
                    original: `${import.meta.env.VITE_API_URL}/image/book/${book.thumbnail}`,
                    thumbnail: `${import.meta.env.VITE_API_URL}/image/book/${book.thumbnail}`,
                    originalClass: "original-normal",
                    thumbnailClass: "thumbnail-normal",
                });
            }
            if (book.slider) {
                book.slider.forEach(item => {
                    images.push({
                        original: `${import.meta.env.VITE_API_URL}/image/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_API_URL}/image/book/${item}`,
                        originalClass: "original-normal",
                        thumbnailClass: "thumbnail-normal",
                    });
                });
            }
            setImageGallery(images);
        }
    }, [book]);

    const handleOnClickImage = () => {
        setCurrentIndex(refGallery.current?.getCurrentIndex() || 0);
        setIsOpenModalGallery(true);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (quantity === +book.quantity) return;
        setQuantity(quantity + 1);
    };

    const handleAddToCart = (isBuyNow = false) => {
        if (!user) {
            message.error("Bạn cần đăng nhập để thực hiện tính năng này");
            return;
        }

        const cartStore = localStorage.getItem('cart');
        if (cartStore) {
            const cart = JSON.parse(cartStore);
            const index = cart.findIndex((item: ICart) => item.id === book.id);
            if (index !== -1) {
                cart[index].quantity += quantity;
            } else {
                cart.push({ id: book.id, quantity: quantity, detail: book });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            setCart(cart);
        } else {
            const data = [{ id: book.id, quantity: quantity, detail: book }];
            localStorage.setItem('cart', JSON.stringify(data));
            setCart(data);
        }

        if (isBuyNow) {
            navigate("/order")
        } else {
            message.success("Thêm sản phẩm vào giỏ hàng thành công")
        }
    };

    return (
        <>
            <div style={{ backgroundColor: '#f5f5f5', padding: '20px 0' }}>
                <div className="view-detail-book" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                        <Row gutter={[24, 24]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={imageGallery}
                                    showFullscreenButton={false}
                                    showPlayButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    onClick={() => handleOnClickImage()}
                                    slideOnThumbnailOver={true}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={imageGallery}
                                        showFullscreenButton={false}
                                        showPlayButton={false}
                                        renderLeftNav={() => <></>}
                                        renderRightNav={() => <></>}
                                        onClick={() => handleOnClickImage()}
                                        showThumbnails={true}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className="book-info">
                                        <div className="author">Tác giả: <a href="#" style={{ color: '#1890ff' }}>{book.author}</a></div>
                                        <div className="title">{book.mainTest}</div>
                                        <div className="rating">
                                            <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 14 }} />
                                            <span className="sold">
                                                <Divider type="vertical" />
                                                <span>Đã bán {book.sold ? book.sold : 0}</span>
                                            </span>
                                        </div>
                                        <div className="price">
                                            <span className="currency">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price ?? 0)}
                                            </span>
                                        </div>
                                        <div className="delivery">
                                            <div className="delivery-option">
                                                <span className="label" style={{ color: '#757575', width: 110, display: 'inline-block' }}>Vận Chuyển</span>
                                                <span className="free-ship" style={{ marginLeft: 12 }}>Miễn phí vận chuyển</span>
                                            </div>
                                        </div>

                                        <div className="quantity" style={{ marginTop: 20 }}>
                                            <span className="label" style={{ color: '#757575', width: 110, display: 'inline-block' }}>Số Lượng</span>
                                            <span className="quantity-control" style={{ display: 'flex', alignItems: 'center' }}>
                                                <button
                                                    onClick={decreaseQuantity}
                                                >
                                                    <MinusOutlined />
                                                </button>
                                                <input
                                                    value={quantity}
                                                    onChange={(e) => +e.target.value > 0 && +e.target.value <= +book.quantity && setQuantity(parseInt(e.target.value) || 1)}
                                                />
                                                <button
                                                    onClick={increaseQuantity}
                                                >
                                                    <PlusOutlined />
                                                </button>
                                            </span>
                                        </div>
                                        <div className="buy" >
                                            <button className="cart" >
                                                <BsCartPlus className="icon-cart" />
                                                <span onClick={() => handleAddToCart()}>Thêm vào giỏ hàng</span>
                                            </button>
                                            <button className="now">
                                                <span onClick={() => handleAddToCart(true)}>Mua ngay</span>
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div >

            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                title="Danh sách hình ảnh"
                currentIndex={currentIndex}
                items={imageGallery}
            />
        </>
    );
};

export default BookDetail;