import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, type UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";
import Exceljs from 'exceljs';
import { Buffer } from 'buffer';
import { ImportUserApi } from "services/api";
import templateFile from "assets/template/user.xlsx?url";

interface IImportUser {
    isImportUser: boolean;
    setIsImportUser: (isImportUser: boolean) => void;
    refreshTable: () => void;
}

interface IDataImport {
    key: string | number;
    fullName: string;
    email: string;
    phone: string;
}

const ImportUser = (props: IImportUser) => {
    const { message, notification } = App.useApp();
    const { isImportUser, setIsImportUser, refreshTable } = props;
    const [dataImport, setDataImport] = useState<IDataImport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const propsUpload: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        customRequest({ onSuccess }) {
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess("ok");
                }
            }, 1000)
        },
        async onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} upload thành công`);
                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    if (!file) return;

                    try {
                        const workbook = new Exceljs.Workbook();
                        const arrayBuffer = await file.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        await workbook.xlsx.load(buffer);

                        let jsonData: IDataImport[] = [];
                        const worksheet = workbook.getWorksheet(1); // Lấy sheet đầu tiên
                        if (worksheet) {
                            worksheet.eachRow((row, rowNumber) => {
                                if (rowNumber > 1) { // Bỏ qua header row
                                    const rowData: IDataImport = {
                                        key: rowNumber, // key duy nhất cho mỗi dòng
                                        fullName: row.getCell(1).value?.toString() || '',
                                        email: row.getCell(2).value?.toString() || '',
                                        phone: row.getCell(3).value?.toString() || ''
                                    };
                                    jsonData.push(rowData);
                                }
                            });
                        }

                        setDataImport(jsonData);
                    } catch (error) {
                        message.error('Có lỗi xảy ra khi đọc file Excel');
                        console.error(error);
                    }
                }
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },

    };

    const handleImport = async () => {
        setIsLoading(true);
        const data = dataImport.map(item => ({
            fullName: item.fullName,
            email: item.email,
            phone: item.phone,
            password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD
        }));

        const res = await ImportUserApi(data);

        if (res.data) {
            notification.success({
                message: "Import thành công",
                description: `Đã import ${res.data?.countSuccess} người dùng thành công và ${res.data?.countError} người dùng thất bại`
            });
            refreshTable();
            setDataImport([]);
            setIsImportUser(false);
        }
        setIsLoading(false);
    }

    return (
        <>
            <Modal
                title="Import User"
                open={isImportUser}
                onCancel={() => {
                    setIsImportUser(false);
                    setDataImport([]);
                }}
                width={"50vw"}
                okText="Import data"
                cancelText="Cancel"
                okButtonProps={{
                    disabled: dataImport.length === 0,
                    loading: isLoading
                }}
                onOk={() => handleImport()}
                maskClosable={false}
                destroyOnHidden={true}

            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Bấm vào đây để upload file</p>
                    <p className="ant-upload-hint">
                        Chỉ được upload file .csv, .xls, .xlsx or
                        &nbsp;
                        <a
                            onClick={e => e.stopPropagation()}
                            href={templateFile} download>
                            Tải file mẫu
                        </a>
                    </p>
                </Dragger>

                <div style={{ paddingTop: 20 }}>
                    <Table
                        title={() => "Danh sách người dùng"}
                        dataSource={dataImport}
                        rowKey="key"
                        columns={[
                            { dataIndex: 'fullName', title: 'Họ tên' },
                            { dataIndex: 'email', title: 'Email' },
                            { dataIndex: 'phone', title: 'Số điện thoại' },
                        ]}
                    />
                </div>
            </Modal>
        </>
    )

}

export default ImportUser;
