
import { useEffect, useState } from 'react';
import { Layout, Checkbox, Button, Card, Col, Rate, Tabs, Row, Form, InputNumber, Divider, Pagination, Spin, type FormProps, Empty, message, App } from 'antd';
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import 'styles/home.scss';
import { getBookApi, getCategoryApi } from 'services/api';
import { useNavigate, useOutletContext } from 'react-router-dom';


const { TabPane } = Tabs;

type FieldType = {
    range: {
        from: number;
        to: number;
    }
    category: string[];
};

const HomePage = () => {

    const [search] = useOutletContext() as any;
    const listTab = [
        {
            key: '1',
            label: 'Phổ biến',
            value: 'sort=sold,desc'
        },
        {
            key: '2',
            label: 'Hàng Mới',
            value: 'sort=createdAt,desc'
        },
        {
            key: '3',
            label: 'Giá Thấp Đến Cao',
            value: 'sort=price,asc'
        },
        {
            key: '4',
            label: 'Giá Cao Đến Thấp',
            value: 'sort=price,desc'
        }
    ]


    const [listBook, setListBook] = useState<IBook[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>('');
    const [sort, setSort] = useState<string>('');

    const [form] = Form.useForm();
    const { message } = App.useApp();
    const navigate = useNavigate();

    const [category, setCategory] = useState<string[]>([]);
    useEffect(() => {
        const getCategory = async () => {
            const res = await getCategoryApi();
            setCategory(res.data || [])
        }
        getCategory();
    }, []);


    useEffect(() => {
        fetchBook();
    }, [currentPage, pageSize, sort, filter, search]);

    const fetchBook = async () => {
        setIsLoading(true);
        let query = `page=${currentPage}&size=${pageSize}`;
        if (!sort) {
            query += `&sort=sold,desc`
        }
        if (filter) {
            query += `&${filter}`;
        }
        if (sort) {
            query += `&${sort}`;
        }
        if (search) {
            query += `&mainTest=${search}`;
        }
        const res = await getBookApi(query);
        if (res.statusCode === 200) {
            setListBook(res.data?.result || []);
            setTotal(res.data?.meta.total || 0);
        }
        setIsLoading(false);
    }

    const handleOnChangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination.current !== currentPage) {
            setCurrentPage(pagination.current);
        }
        if (pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrentPage(1);
        }
    }

    const handleFilter = (changedValues: any, value: any) => {
        
        if (changedValues.category) {
            const cate = value.category;
           
            if (cate.length > 0) {
                const f = cate.join(',');
                
                setFilter(`category=/in/${f}`);
            } else {
                setFilter('');
            }
        } else {
            setFilter('');
        }
    }

    const handleSort = (key: string) => {
        setSort(listTab.find(item => item.key === key)?.value || '');
    }

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0 && values?.range?.from <= values?.range?.to) {
            let f = `price=/<>/${values.range.from},${values.range.to}`;
            if (values?.category?.length > 0) {
                const cate = values.category.join(',');
                f += `&category=/in/${cate}`;
            }
            setFilter(f);
        } else {
            message.error("Vui lòng nhập đúng thứ tự khoảng giá")
        }
    }
    return (
        <div style={{ background: "#ededed" }}>
            <Layout className="book-store">
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0}>
                        <div className="filter-sidebar">
                            <div className="filter-header">
                                <div>
                                    <FilterTwoTone />
                                    <span>Bộ lọc tìm kiếm</span>
                                </div>

                                <ReloadOutlined title='Reset' onClick={() => {
                                    setFilter('');
                                    form.resetFields();
                                }} />
                            </div>
                            <Form
                                form={form}
                                layout='vertical'
                                onFinish={onFinish}
                                onValuesChange={(changedValues, value) => {
                                    changedValues.category && handleFilter(changedValues, value);
                                }}
                            >
                                <Form.Item name='category' label='Danh mục sản phẩm' labelCol={{ span: 24 }}>

                                    <Checkbox.Group>
                                        <Row>
                                            {category.map(item => (
                                                <Col span={24}>
                                                    <Checkbox style={{ paddingBottom: "10px" }} key={item} value={item}>{item}</Checkbox>
                                                </Col>


                                            ))}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Divider />
                                <Form.Item name='price' label='Khoảng giá' labelCol={{ span: 24 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Form.Item name={["range", 'from']}>
                                            <InputNumber
                                                name='from'
                                                min={0}
                                                placeholder='đ TỪ'
                                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            />
                                        </Form.Item>
                                        <span>-</span>
                                        <Form.Item name={["range", 'to']}>
                                            <InputNumber
                                                name='to'
                                                min={0}
                                                placeholder='đ ĐẾN'
                                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            />
                                        </Form.Item>
                                    </div>
                                    <Button onClick={() => form.submit()} type='primary' style={{ width: "100%" }} htmlType='submit'>Áp dụng</Button>
                                </Form.Item>
                                <Divider />
                                <div className="filter-section">
                                    <h3>Đánh giá</h3>
                                    <div className="rating-options">
                                        <div className="rating-option">
                                            <Rate disabled defaultValue={5} />
                                        </div>
                                        <div className="rating-option">
                                            <Rate disabled defaultValue={4} />
                                            <span>trở lên</span>
                                        </div>
                                        <div className="rating-option">
                                            <Rate disabled defaultValue={3} />
                                            <span>trở lên</span>
                                        </div>
                                        <div className="rating-option">
                                            <Rate disabled defaultValue={2} />
                                            <span>trở lên</span>
                                        </div>
                                        <div className="rating-option">
                                            <Rate disabled defaultValue={1} />
                                            <span>trở lên</span>
                                        </div>
                                    </div>
                                </div>
                            </Form>



                        </div>
                    </Col>

                    <Col md={20} xs={24}>
                        <Spin spinning={isLoading} tip="Loading..." >
                            <div className="book-content">
                                <Tabs defaultActiveKey="1" className="sort-tabs" onChange={(key) => handleSort(key)}>
                                    {listTab.map(item => (
                                        <TabPane tab={item.label} key={item.key} />
                                    ))}
                                </Tabs>

                                {listBook.length > 0 ? (
                                    <div className="book-list">
                                        {listBook.map((book) => (
                                            <Card onClick={() => {
                                                
                                                navigate(`/book/${book.id}`)
                                            }}
                                                key={book.id}
                                                cover={<img src={`${import.meta.env.VITE_API_URL}/image/book/${book.thumbnail}`} />}
                                                className="book-card"
                                            >
                                                <div className="book-info">
                                                    <h4 className="book-title">{book.mainTest}</h4>
                                                    <div className="book-price"> {book.price.toLocaleString()} đ</div>
                                                    <div className="book-rating">
                                                        <Rate disabled defaultValue={5} />
                                                        <span className="book-sold">Đã bán {book.sold ?? 77}</span>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-data-container">
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description={
                                                <span>Không tìm thấy sách phù hợp với bộ lọc của bạn</span>
                                            }
                                        />
                                    </div>
                                )}
                                <Divider />
                                <Row style={{ display: "flex", justifyContent: "center" }}>
                                    <Pagination
                                        onChange={(page, pageSize) => handleOnChangePage({ current: page, pageSize })}
                                        current={currentPage}
                                        pageSize={pageSize}
                                        total={total}
                                        responsive
                                    />
                                </Row>
                            </div>
                        </Spin>
                    </Col>
                </Row>
            </Layout>
        </div>

    );
};

export default HomePage;