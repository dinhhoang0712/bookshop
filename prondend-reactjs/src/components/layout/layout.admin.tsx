import { Layout, Menu, Avatar, Dropdown, App, Space } from 'antd';
import {
  AppstoreOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import './layout.admin.scss';
import { useAppContext } from 'components/context/app.context';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LogoutApi } from 'services/api';
import { useEffect, useState } from 'react';
import ManageAccount from 'components/client/account';

const { Sider, Header, Content } = Layout;

const items = [
  { key: '/admin', icon: <AppstoreOutlined />, label: <Link to="/admin">Dashboard</Link> },
  { key: '/admin/users', icon: <UserOutlined />, label: <Link to="/admin/users">Manage Users</Link> },
  { key: '/admin/books', icon: <BookOutlined />, label: <Link to="/admin/books">Manage Books</Link> },
  { key: '/admin/orders', icon: <DollarOutlined />, label: <Link to="/admin/orders">Manage Orders</Link> },
];

const LayoutAdmin = () => {
  const { user, setUser, setIsAuthenticated } = useAppContext();
  const { message } = App.useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false)
  const location = useLocation();
  const urlAvatar = `${import.meta.env.VITE_API_URL}/image/avatar/${user?.avatar}`;

  const userMenu = {
    items: [
      { key: 'account', label: <label onClick={() => setIsModalOpen(true)}>Quản lý tài khoản</label> },
      { key: 'orders', label: <Link to="/">Trang chủ</Link> },
      { key: 'logout', label: <Link onClick={() => handleLogout()} to="/login">Đăng xuất</Link> }
    ]
  };

  const handleLogout = async () => {
    const res = await LogoutApi();
    if (res.statusCode === 200) {
      message.success(res.message);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    }
  }

  useEffect(() => {
    const active: any = items.find(item => location.pathname === (item!.key as any)) ?? "/admin";
    setActiveMenu(active.key)
  })

  return (
    <>
      <Layout className="admin-layout">
        <Sider collapsed={collapsed} className="admin-layout__sider" width={220} breakpoint="lg" collapsedWidth="60">
          <div className="admin-layout__logo" >{collapsed ? '' : 'Admin'}</div>
          <Menu
            className="admin-layout__menu"
            mode="inline"
            selectedKeys={[activeMenu]}
            items={items}
          />
        </Sider>
        <Layout>
          <Header className="admin-layout__header">
            <MenuFoldOutlined className="admin-layout__toggle" onClick={() => setCollapsed(!collapsed)} />
            <div className="admin-layout__header-right">
              <Dropdown menu={userMenu} placement="bottomRight">
                <Space>
                  {user?.avatar ? <Avatar src={urlAvatar} /> : <Avatar icon={<UserOutlined />} />}
                  <span className="admin-layout__header-user">{user?.fullName}</span>
                </Space>
              </Dropdown>
            </div>
          </Header>
          <Content className="admin-layout__content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      <ManageAccount
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>

  );
};

export default LayoutAdmin;


