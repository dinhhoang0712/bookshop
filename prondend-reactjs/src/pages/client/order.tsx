import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Steps } from "antd";
import OrderDetail from "components/client/order";
import Payment from "components/client/order/payment";
import ResultPage from "components/client/order/result";
import 'styles/order.scss'

const OrderPage = () => {
    const [searchParams] = useSearchParams();
    const initialStep = Number(searchParams.get("step")) || 0;
    const [currentStep, setCurrentStep] = useState(initialStep);
    useEffect(() => {
        const stepFromUrl = Number(searchParams.get("step")) || 0;
        setCurrentStep(stepFromUrl);
    }, [searchParams]);

    return (
        <div style={{ background: "#efefef", padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: "1400px", margin: "0 auto" }}>
                <div className="order-step">
                    <Steps
                        size="small"
                        current={currentStep}
                        items={[
                            { title: "Đơn hàng" },
                            { title: "Đặt hàng" },
                            { title: "Thanh toán" },
                        ]}
                    />
                </div>
                {currentStep === 0 && <OrderDetail setCurrentStep={setCurrentStep} />}
                {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}
                {currentStep === 2 && <ResultPage />}
            </div>
        </div>
    );
};

export default OrderPage;
