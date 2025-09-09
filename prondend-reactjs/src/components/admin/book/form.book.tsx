import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, Divider, Form, Image, Input, InputNumber, Modal, Row, Select, Upload, type FormProps, type GetProp, type UploadFile, type UploadProps } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import { useEffect, useState } from "react";
import { callUploadFileApi, CreateBookApi, UpdateBookApi, getCategoryApi, FetchBookDetailApi } from "services/api";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";
import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
type UserUploadFile = 'thumbnail' | 'slider';


interface IBookFormProps {
    openModal: boolean;
    setOpenModal: (open: boolean) => void;
    refreshTable: () => void;
    bookId?: number | null; // ID của sách khi cập nhật, undefined khi tạo mới
    mode: 'create' | 'update'; // Chế độ form: tạo mới hoặc cập nhật
}

type FieldType = {
    mainTest: string;
    author: string;
    price: number;
    category: string;
    quantity: number;
    thumbnail: any;
    slider: any;
};

const BookForm = (props: IBookFormProps) => {
    const { openModal, setOpenModal, refreshTable, bookId, mode } = props;
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();
    const [submit, setSubmit] = useState(false);
    const [loading, setLoading] = useState(false);

    const [loadingThumbnail, setLoadingThumbnail] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);

    const [category, setCategory] = useState<{
        label: string;
        value: string;
    }[]>([]);

    // Lấy danh sách thể loại sách khi component được khởi tạo
    useEffect(() => {
        const fetchCategory = async () => {
            const res = await getCategoryApi();
            if (res.data) {
                setCategory(res.data.map((item: string) => ({
                    label: item,
                    value: item
                })));
            }
        }
        fetchCategory();
    }, []);

    // Lấy thông tin chi tiết sách khi ở chế độ cập nhật và bookId tồn tại
    useEffect(() => {
        const fetchBookDetail = async () => {
            if (mode === 'update' && bookId) {
                setLoading(true);
                try {
                    const res = await FetchBookDetailApi(bookId);
                    if (res.data) {
                        const bookData = res.data;
                        const arrThumbnail = [
                            {
                                uid: uuidv4(),
                                name: bookData.thumbnail,
                                status: 'done',
                                url: `${import.meta.env.VITE_API_URL}/image/book/${bookData.thumbnail}`
                            }
                        ]

                        const arrSlider = bookData?.slider?.map((item: string) => ({
                            uid: uuidv4(),
                            name: item,
                            status: 'done',
                            url: `${import.meta.env.VITE_API_URL}/image/book/${item}`
                        }))
                        // Cập nhật form với dữ liệu sách
                        form.setFieldsValue({
                            mainTest: bookData.mainTest,
                            author: bookData.author,
                            price: bookData.price,
                            category: bookData.category,
                            quantity: bookData.quantity,
                            thumbnail: arrThumbnail,
                            slider: arrSlider
                        });

                        setFileListThumbnail(arrThumbnail as any);
                        setFileListSlider(arrSlider as any);
                    } else {
                        message.error('Không thể lấy thông tin sách!');
                    }
                } catch (error) {
                    console.error('Error fetching book detail:', error);
                    message.error('Có lỗi xảy ra khi lấy thông tin sách!');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchBookDetail();
    }, [mode, bookId, form]);

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setSubmit(true);
        const { mainTest, author, price, category, quantity } = values;
        const thumbnail = fileListThumbnail?.[0]?.name ?? "";
        const slider = fileListSlider?.map(item => item.name) ?? [];

        try {
            let res;
            if (mode === 'create') {
                res = await CreateBookApi({
                    mainTest,
                    author,
                    price,
                    category,
                    quantity,
                    thumbnail,
                    slider,
                });
            } else {
                // Nếu là mode update, gọi API update với bookId
                res = await UpdateBookApi({
                    id: bookId as number,
                    mainTest,
                    author,
                    price,
                    category,
                    quantity,
                    thumbnail,
                    slider,
                });
            }

            if (res.data) {
                notification.success({
                    message: res.message || (mode === 'create' ? 'Thêm sách thành công' : 'Cập nhật sách thành công'),
                });
                setFileListThumbnail([]);
                setFileListSlider([]);
                refreshTable();
                setOpenModal(false);
                form.resetFields();
            } else {
                notification.error({
                    message: mode === 'create' ? 'Thêm sách thất bại' : 'Cập nhật sách thất bại',
                    description: res.message,
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            notification.error({
                message: mode === 'create' ? 'Thêm sách thất bại' : 'Cập nhật sách thất bại',
                description: 'Có lỗi xảy ra, vui lòng thử lại sau.',
            });
        } finally {
            setSubmit(false);
        }
    };

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/webp' || file.type === 'image/gif';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên file ảnh!');
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Kích thước file ảnh không được vượt quá 2MB!');
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleRemove = (file: UploadFile, type: UserUploadFile) => {
        if (type === "thumbnail") {
            setFileListThumbnail([])
        } else {
            const newSlider = fileListSlider.filter((item) => item.uid !== file.uid);
            setFileListSlider(newSlider);
        }
    }

    const handleChange = (info: UploadChangeParam, type: UserUploadFile) => {
        if (info.file.status === 'uploading') {
            type === 'slider' ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }
        if (info.file.status === 'done') {
            type === 'slider' ? setLoadingSlider(false) : setLoadingThumbnail(false);
            message.success(`${info.file.name} tải lên thành công`);
        } else if (info.file.status === 'error') {
            type === 'slider' ? setLoadingSlider(false) : setLoadingThumbnail(false);
            message.error(`${info.file.name} tải lên thất bại`);
        }
    };

    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadFile) => {
        const { onSuccess, onError } = options;
        const file = options.file as UploadFile;

        try {
            const res = await callUploadFileApi(file, "book");

            if (res.data) {
                const uploadFile = {
                    uid: file.uid,
                    name: res.data[0],
                    status: 'done' as const,
                    url: `${import.meta.env.VITE_API_URL}/image/book/${res.data[0]}`
                };

                if (type === 'thumbnail') {
                    setFileListThumbnail([uploadFile]);
                } else {
                    setFileListSlider((prev) => [...prev, uploadFile]);
                }
                onSuccess && onSuccess("ok");
            } else {
                message.error("Tải lên ảnh thất bại!");
                onError && onError(new Error("Upload failed"));
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            message.error("Có lỗi xảy ra khi tải lên ảnh!");
            onError && onError(new Error("Upload error"));
        }
    }

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    const getModalTitle = () => {
        return mode === 'create' ? 'Thêm mới sách' : 'Cập nhật sách';
    }

    const getOkText = () => {
        return mode === 'create' ? 'Tạo mới' : 'Cập nhật';
    }

    return (
        <Modal
            title={getModalTitle()}
            open={openModal}
            onOk={() => {
                form.submit();
            }}
            onCancel={() => {
                setOpenModal(false);
                form.resetFields();
                setFileListThumbnail([]);
                setFileListSlider([]);
            }}
            okButtonProps={{
                loading: submit
            }}
            okText={getOkText()}
            cancelText="Hủy"
            width={"50vw"}
            confirmLoading={submit}
            maskClosable={false}
            destroyOnClose={true}
        >
            <Divider />
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <LoadingOutlined style={{ fontSize: 24 }} spin />
                    <p>Đang tải thông tin sách...</p>
                </div>
            ) : (
                <Form
                    form={form}
                    name="bookForm"
                    onFinish={onFinish}
                    layout='vertical'
                    autoComplete="off"
                >
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tên sách"
                                name="mainTest"
                                rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Tác giả"
                                name="author"
                                rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Giá"
                                name="price"
                                rules={[{ required: true, message: 'Vui lòng nhập giá sách!' }]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: '100%' }}
                                    formatter={(value) => {
                                        if (value) {
                                            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                        }
                                        return '';
                                    }}
                                    addonAfter=" đ"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Thể loại"
                                name="category"
                                rules={[{ required: true, message: 'Vui lòng chọn thể loại sách!' }]}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    options={category}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Số lượng"
                                name="quantity"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng sách!' }]}
                            >
                                <InputNumber
                                    min={1}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Ảnh đại diện"
                                name="thumbnail"
                                rules={[{ required: true, message: 'Vui lòng tải lên ảnh đại diện!' }]}
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    className="w-full"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'thumbnail')}
                                    onRemove={(file) => handleRemove(file, 'thumbnail')}
                                    onPreview={handlePreview}
                                    fileList={fileListThumbnail}
                                >
                                    {fileListThumbnail.length >= 1 ? null : (
                                        <div>
                                            {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    className="w-full"
                                    multiple={false}
                                    customRequest={(options) => handleUploadFile(options, 'slider')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onRemove={(file) => handleRemove(file, 'slider')}
                                    onPreview={handlePreview}
                                    fileList={fileListSlider}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        {previewImage && (
                            <Image
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}
                    </Row>
                </Form>
            )}
        </Modal>
    )
}

export default BookForm;