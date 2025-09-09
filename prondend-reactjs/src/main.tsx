
import { createRoot } from 'react-dom/client'
import Layout from './layout'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import BookPage from 'pages/client/book';
import LoginPage from 'pages/client/auth/login';
import RegisterPage from 'pages/client/auth/register';
import HomePage from 'pages/client/home';
import 'styles/global.scss';
import { App, ConfigProvider } from 'antd';
import { AppProvider } from 'components/context/app.context';
import ProtectedRoute from 'components/auth';
import LayoutAdmin from 'components/layout/layout.admin';
import DashboardPage from 'pages/admin/dashboard';
import ManageUserPage from 'pages/admin/manage.user';
import ManageBookPage from 'pages/admin/manage.book';
import ManageOrderPage from 'pages/admin/manage.order';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import OrderPage from 'pages/client/order';
import HistoryPage from 'pages/client/history';
import VerifyEmail from 'pages/client/auth/verify-email';
import PaymentRedirect from 'components/client/order/payment.redirect';
import LoginGoogle from 'pages/client/auth/login.google';
import ResetPasswordPage from 'pages/client/auth/reset.password';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },

      {
        path: "/book/:id",
        element: <BookPage />
      },
      {
        path: "/order",
        element: (
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        )
      },
      {
        path: "/history",
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        )
      }
    ]
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <LayoutAdmin />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: "users",
        element: <ManageUserPage />
      },
      {
        path: "books",
        element: <ManageBookPage />
      },
      {
        path: "orders",
        element: <ManageOrderPage />
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />
  },
  {
    path: "/payment-redirect",
    element: <PaymentRedirect />
  },
  {
    path: "/oauth2-success",
    element: <LoginGoogle />
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />
  }
]);


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <App>
    <AppProvider>
      <ConfigProvider locale={enUS}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </AppProvider>
  </App>
  // </StrictMode>,
)
