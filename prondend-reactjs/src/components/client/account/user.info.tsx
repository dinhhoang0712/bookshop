import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Avatar, Button, Col, Form, Input, Row, Upload, type FormProps, type UploadFile } from "antd";
import { useAppContext } from "components/context/app.context";
import { useEffect, useState } from "react";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { callUploadFileApi, updateUserInfoApi } from "services/api";
import type { UploadChangeParam } from "antd/es/upload";


type FieldType = {
    id: number;
    email: string;
    fullName: string;
    phone: string;
    img: string;
}

const UserInfo = () => {
    const [form] = Form.useForm();
    const { user, setUser } = useAppContext();

    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
    const [isLoading, setIsLoading] = useState(false);
    const { message, notification } = App.useApp();

    const urlAvatar = `${import.meta.env.VITE_API_URL}/image/avatar/${userAvatar}`;

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                email: user.email,
                id: user.id,
                fullName: user.fullName,
                phone: user.phone,
            })
        }
    }, [user])

    const handleUploadFile = async (options: RcCustomRequestOptions) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const res = await callUploadFileApi(file, "avatar")
        if (res.data && res) {
            const newAvatar = res.data[0];
            setUserAvatar(newAvatar);
           
            if (onSuccess) {
                onSuccess('ok')
            } else {
                message.error(res.message)
            }
        }
    };

    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadFile,
        onChange(info: UploadChangeParam) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} upload thành công`)
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} upload thất bại`)
            }
        }
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { fullName, phone, id } = values;
        setIsLoading(true);
        const res = await updateUserInfoApi({
            id,
            fullName,
            phone,
            img: userAvatar
        })

        if (res) {
            setUser({
                ...user!,
                fullName,
                phone,
                avatar: userAvatar
            })
            message.success("Cập nhật thông tin tài khoản thành công");
            localStorage.removeItem("access_token");
        } else {
            notification.error({
                message: "Cập nhật thông tin tài khoản thất bại"
            })
        }
        setIsLoading(false);
    }

    return (
        <div style={{ minHeight: 400 }}>
            <Row>
                <Col sm={24} md={12}>
                    <Row gutter={[30, 30]}>
                        <Col span={24}>
                            <Avatar
                                size={{ xs: 32, sm: 34, md: 80, lg: 128, xl: 160, xxl: 200 }}
                                icon={<AntDesignOutlined />}
                                src={urlAvatar}
                                shape="circle" />

                        </Col>
                        <Col span={24}>
                            <Upload {...propsUpload}>
                                <Button icon={<UploadOutlined />}>
                                    Upload Avatar
                                </Button>
                            </Upload>
                        </Col>
                    </Row>
                </Col>
                <Col sm={24} md={12}>
                    <Form
                        onFinish={onFinish}
                        form={form}
                        autoComplete="off">

                        <Form.Item<FieldType>
                            hidden
                            labelCol={{ span: 24 }}
                            label="id"
                            name="id"
                        >
                            <Input disabled hidden />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Email"
                            name="email"
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Tên hiển thị"
                            name="fullName"
                            rules={[{ required: true, message: 'Tên hiển thị không được bỏ trống' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item<FieldType>
                            labelCol={{ span: 24 }}
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Số điện thoại không được bỏ trống' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Button htmlType="submit" color="primary" variant="solid" loading={isLoading}>Cập nhật</Button>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default UserInfo;
