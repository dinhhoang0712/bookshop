import { useEffect, useState } from "react";
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Result, Spin, Card, Typography } from "antd";
import "./verify-email.scss";
import { verifyEmail } from "services/api";
import { useSearchParams } from "react-router-dom";

const { Title, Paragraph } = Typography;

const VerifyEmail = () => {

  const [params] = useSearchParams();
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleVerifyEmail = async () => {
      const token = params.get("token");
      if (!token) {
        setStatus("error");
        setMessage("Không tìm thấy mã xác thực");
        return;
      }

      try {
        const res = await verifyEmail(token);
        if (res) {
          setStatus("success");
          setMessage("Email của bạn đã được xác thực thành công!");
        } else {
          setStatus("error");
          setMessage("Xác thực email thất bại. Vui lòng thử lại.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại sau.");
      }
    };

    handleVerifyEmail();
  }, []);

  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <Result
            icon={<CheckCircleOutlined className="verify-email__success-icon" />}
            title="Xác Thực Thành Công!"
            subTitle={message}
            extra={[
              <Button
                type="primary"
                size="large"
                key="login"
                onClick={() => window.location.href = "/login"}
                className="verify-email__button"
              >
                Tiếp Tục Đăng Nhập
              </Button>,
              <Button
                size="large"
                key="home"
                onClick={() => window.location.href = "/"}
                className="verify-email__button"
              >
                Về Trang Chủ
              </Button>
            ]}
          />
        );

      case "error":
        return (
          <Result
            status="error"
            icon={<CloseCircleOutlined className="verify-email__error-icon" />}
            title="Xác Thực Thất Bại"
            subTitle={message}
            extra={[
              <Button
                type="primary"
                danger
                size="large"
                key="retry"
                onClick={() => window.location.reload()}
                className="verify-email__button"
              >
                Thử Lại
              </Button>,
              <Button
                type="primary"
                size="large"
                key="resend"
                onClick={() => window.location.href = "/resend-verification"}
                className="verify-email__button"
              >
                Gửi Lại Email Xác Thực
              </Button>,
              <Button
                size="large"
                key="home"
                onClick={() => window.location.href = "/"}
                className="verify-email__button"
              >
                Về Trang Chủ
              </Button>
            ]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="verify-email">
      <div className="verify-email__container">
        <Card className="verify-email__card">
          <div className="verify-email__header">
            <div className="verify-email__icon-wrapper">
              <MailOutlined className="verify-email__mail-icon" />
            </div>
            <Title level={1} className="verify-email__main-title">
              Xác Thực Email
            </Title>
          </div>

          <div className="verify-email__content">
            {renderContent()}
          </div>

          <div className="verify-email__footer">
            <Paragraph className="verify-email__support-text">
              Cần hỗ trợ? Liên hệ{" "}
              <a href="/support" className="verify-email__support-link">
                đội ngũ hỗ trợ
              </a>
            </Paragraph>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;