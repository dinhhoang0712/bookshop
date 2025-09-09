import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react"
import CountUp from "react-countup";
import { getDashboardApi } from "services/api";


const AdminDashboard = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0,
        countBook: 0
    })

    useEffect(() => {
        const initDashboard = async () => {
            const res = await getDashboardApi();
            if (res.data) {
                setDataDashboard(res.data)
            }
        }
        initDashboard();
    }, []);

    const formatter = (value: any) => <CountUp end={value} separator="," />
    return (
        <Row gutter={[40, 40]}>
            <Col span={8}>
                <Card>
                    <Statistic title="Tổng User"
                        value={dataDashboard.countUser}
                        formatter={formatter} />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic title="Tổng đơn hàng"
                        value={dataDashboard.countOrder}
                        formatter={formatter} />
                </Card>
            </Col>
            <Col span={8}>
                <Card>
                    <Statistic title="Tổng số sách"
                        value={dataDashboard.countBook}
                        formatter={formatter} />
                </Card>
            </Col>
        </Row>
    )
}
export default AdminDashboard;