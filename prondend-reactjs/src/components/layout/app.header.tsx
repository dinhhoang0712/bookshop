
import { Layout, Input, Badge, Dropdown, Avatar, Space, App, Button, Popover, Empty } from 'antd';
import { ShoppingCartOutlined, UserOutlined, FileSearchOutlined } from '@ant-design/icons';
import './app.header.scss';
import { useAppContext } from 'components/context/app.context';
import { Link, useNavigate } from 'react-router-dom';
import { LogoutApi } from 'services/api';
import { useState } from 'react';
import ManageAccount from 'components/client/account';

const { Header } = Layout;



interface IProps {
    search: string;
    setSearch: (search: string | "") => void
}

const AppHeader = (props: IProps) => {
    const { setSearch } = props;
    const { user, setUser, setIsAuthenticated, isAuthenticated } = useAppContext();
    const { message } = App.useApp();
    const urlAvatar = `${import.meta.env.VITE_API_URL}/image/avatar/${user?.avatar}`;
    const { cart } = useAppContext();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const cartCount = cart.length;

    const userMenu = {
        items: [
            { key: 'account', label: <label onClick={() => setIsModalOpen(true)}>Quản lý tài khoản</label> },
            { key: 'orders', label: <Link to="/history">Lịch sử mua hàng</Link> },
            { key: 'logout', label: <Link onClick={() => handleLogout()} to="/login">Đăng xuất</Link> }
        ]
    };

    if (user?.role === 'ADMIN' && !userMenu.items.find(item => item.key === 'admin')) {
        userMenu.items = [{ key: 'admin', label: <Link to="/admin">Trang quản trị</Link> }, ...userMenu.items];
    }

    const handleLogout = async () => {
        const res = await LogoutApi();
        if (res.statusCode === 200) {
            message.success(res.message);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("access_token");
        }
    }

    const content = (
        <div className='pop-cart-body'>
            <div className='pop-cart-content'>
                {cart?.map((book, index) => (
                    <div className='book' key={index}>
                        <img src={`${import.meta.env.VITE_API_URL}/image/book/${book?.detail?.thumbnail}`} />
                        <div>{book?.detail?.mainTest}</div>
                        <div className='price'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price)}
                        </div>
                    </div>
                ))}
                {cartCount > 0 ? (
                    <div className='pop-cart-footer'>
                        <button onClick={() => navigate('/order')}>Xem giỏ hàng</button>
                    </div>
                ) : (
                    <Empty description="Không có sản phẩm nào trong giỏ hàng" />
                )}
            </div>
        </div>
    )
    return (
        <>
            <Header className="app-header">
                <div className="app-header__left">
                    <Link to="/" className="app-header__logo">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="logo" />
                        Vũ Đình Hoàng
                    </Link>
                    <div className="app-header__search">
                        <FileSearchOutlined className="app-header__search-icon" />
                        <Input.Search onChange={(e) => setSearch(e.target.value)} className="app-header__search-input" placeholder="Bạn tìm gì hôm nay" />
                    </div>

                </div>
                <div className="app-header__right">
                    <Popover
                        className='popover-cart'
                        content={content}
                        placement="topRight"
                        rootClassName='popover-cart'
                        title="Giỏ hàng"
                        arrow={true}
                    >
                        <Badge count={cartCount} offset={[-5, 5]}>
                            <ShoppingCartOutlined className="app-header__cart" />
                        </Badge>
                    </Popover>
                    {isAuthenticated ?
                        <Dropdown menu={userMenu} placement="bottomRight">
                            <Space className="app-header__user">
                                {user?.avatar ? <Avatar src={urlAvatar} /> : <Avatar icon={<UserOutlined />} />}
                                <span>{user?.fullName}</span>
                            </Space>
                        </Dropdown>
                        :
                        <Space className="app-header__auth">
                            <Link to="/login">
                                <Button type="primary">Đăng nhập</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Đăng ký</Button>
                            </Link>
                        </Space>
                    }
                </div>
            </Header>

            <ManageAccount
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />

        </>
    );
}

export default AppHeader;
