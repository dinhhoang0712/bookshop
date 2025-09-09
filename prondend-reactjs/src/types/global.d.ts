export { };

declare global {

    interface IBackendResponse<T> {
        statusCode: number | string;
        message: string;
        data?: T;
        error?: string | string[];
    }

    interface IModelPaginate<T> {
        meta: {
            currentPage: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        results: T[];
    }

    interface ILogin {
        accessToken: string;
        user: {
            id: number;
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
        }
    }

    interface IRegister {
        id: number,
        fullName: string,
        email: string,
        phone: string,
        role: string,
        createdAt: Date,
    }

    interface IUser {
        id: number;
        email: string;
        phone: string;
        fullName: string;
        role: string;
        avatar: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IModelTable<T> {
        meta: {
            page: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[];
    }

    interface IImportUser {
        countSuccess: number;
        countError: number;
        detail: any;
    }

    interface IUserTable {
        id: number;
        fullName: string;
        email: string;
        phone: string;
    }

    interface IBook {
        id: number,
        thumbnail: string,
        slider: string[],
        mainTest: string,
        author: string,
        price: number,
        quantity: number,
        category: string,
        createdAt: Date,
        updatedAt: Date,
        sold?: number,
    }

    interface ICart {
        id: number;
        quantity: number;
        detail: IBook;
    }

    interface IHistory {
        id: number;
        name: string;
        phone: string;
        address: string;
        type: string;
        totalPrice: number;
        orderDetails: {
            id: number;
            quantity: number;
            bookName: string;
            img: string;
        }[];
        createdAt: Date;
    }
}