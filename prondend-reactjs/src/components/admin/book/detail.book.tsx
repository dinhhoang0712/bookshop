import { Badge, Descriptions, Divider, Drawer, Image, Upload, type GetProp, type UploadFile, type UploadProps } from "antd";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';



type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
interface IDetailBook {
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
    book: IBook | null;
    setBook: (book: IBook | null) => void;
}

const DetailBook = (props: IDetailBook) => {
    const { isModalOpen, setIsModalOpen, book, setBook } = props;
    const handleClose = () => {
        setIsModalOpen(false);
        setBook(null);
    }

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    useEffect(() => {
        let imgThumbnail: any = {}, sliders: any[] = [];
        if (book?.thumbnail) {
            imgThumbnail = {
                uid: uuidv4(),
                name: book?.thumbnail,
                status: 'done',
                url: `${import.meta.env.VITE_API_URL}/image/book/${book?.thumbnail}`,
            }
        }
        if (book?.slider && book?.slider.length > 0) {
            book?.slider.map((item: string) => {
                sliders.push({
                    uid: uuidv4(),
                    name: item,
                    status: 'done',
                    url: `${import.meta.env.VITE_API_URL}/image/book/${item}`,
                })
            })
        }
        setFileList([imgThumbnail, ...(sliders?.length ? sliders : [])])
    }, [book])


    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);
    return (
        <Drawer
            width={"70vw"}
            title="Chức năng xem chi tiết"
            closable={{ 'aria-label': 'Close Button' }}
            onClose={handleClose}
            open={isModalOpen}
        >
            <Descriptions title="Thông tin sách"
                bordered
                column={2}
            >
                <Descriptions.Item label="Id">{book?.id}</Descriptions.Item>
                <Descriptions.Item span={2} label="Tên sách">{book?.mainTest}</Descriptions.Item>
                <Descriptions.Item label="Tác giả">{book?.author}</Descriptions.Item>
                <Descriptions.Item label="Giá">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.price ?? 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Thể loại" span={2}>
                    <Badge status="processing" text={book?.category} />
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian tạo">{book?.createdAt && new Date(book.createdAt).toLocaleDateString()}</Descriptions.Item>
                <Descriptions.Item label="Thời gian cập nhật">{book?.updatedAt && new Date(book.updatedAt).toLocaleDateString()}</Descriptions.Item>
            </Descriptions>;
            <Divider orientation="left">Hình ảnh</Divider>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                showUploadList={{ showRemoveIcon: false }}
            >
            </Upload>

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
        </Drawer>
    )
}
export default DetailBook;
