import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookDetail from "../../components/client/book/book.detail";
import { App } from "antd";
import { FetchBookDetailApi } from "services/api";

const BookPage = () => {
    let { id } = useParams();
    const { notification } = App.useApp();
    const [book, setBook] = useState<IBook | null>(null);

    useEffect(() => {
        if (id) {
            const fetchBook = async () => {
                const response = await FetchBookDetailApi(Number(id));
                if (response.data) {
                    setBook(response.data);
                } else {
                    notification.error({
                        message: 'Đã xảy ra lỗi',
                        description: response.message
                    });
                }
            }
            fetchBook();
        }
    }, [id])
    return (
        <div>
            {book && <BookDetail book={book} />}
        </div>
    )
}

export default BookPage;