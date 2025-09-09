import axios from "./axios.customize";

export const LoginApi = (email: string, password: string) => {
    const url = '/api/v1/auth/login';
    return axios.post<IBackendResponse<ILogin>>(url, {
        email,
        password
    },
        {
            headers: {
                delay: 1000
            }
        }
    )
}

export const RegisterApi = (data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
}) => {
    const url = '/api/v1/auth/register';
    return axios.post<IBackendResponse<IRegister>>(url, data);
}

export const FetchAccountApi = () => {
    const url = '/api/v1/auth/account';
    return axios.get<IBackendResponse<IUser>>(url, {
        headers: {
            delay: 1000
        }
    });
}

export const LogoutApi = () => {
    const url = '/api/v1/auth/logout';
    return axios.post<IBackendResponse<null>>(url);
}

export const FetchUserTableApi = (query: string) => {
    const url = `/api/v1/users?${query}`;
    return axios.get<IBackendResponse<IModelTable<IUser>>>(url);
}

export const FetchUserDetailApi = (id: number) => {
    const url = `/api/v1/users/${id}`;
    return axios.get<IBackendResponse<IUser>>(url);
}

export const CreateUserApi = (data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
}) => {
    const url = `/api/v1/users`;
    return axios.post<IBackendResponse<IRegister>>(url, data);
}

export const ImportUserApi = (data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
}[]) => {
    const url = `/api/v1/users/bulk-create`;
    return axios.post<IBackendResponse<IImportUser>>(url, data);
}

export const UpdateUserApi = (data: {
    id: number;
    fullName: string;
    phone: string;
}) => {
    const url = `/api/v1/users/${data.id}`;
    return axios.put<IBackendResponse<IUser>>(url, data);
}

export const DeleteUserApi = (id: number) => {
    const url = `/api/v1/users/${id}`;
    return axios.delete<IBackendResponse<null>>(url);
}

export const FetchBookTableApi = (query: string) => {
    const url = `/api/v1/books?${query}`;
    return axios.get<IBackendResponse<IModelTable<IBook>>>(url);
}

export const FetchBookDetailApi = (id: number) => {
    const url = `/api/v1/books/${id}`;
    return axios.get<IBackendResponse<IBook>>(url);
}

export const getBookApi = (query: string) => {
    const url = `/api/v1/books?${query}`;
    return axios.get<IBackendResponse<IModelTable<IBook>>>(url, {
        headers: {
            delay: 1000
        }
    });
}


export const getCategoryApi = () => {
    const url = `/api/v1/database/category`;
    return axios.get<IBackendResponse<string[]>>(url);
}

export const CreateBookApi = (data: {
    thumbnail: string,
    slider: string[],
    mainTest: string,
    author: string,
    price: number,
    quantity: number,
    category: string,
}) => {
    const url = `/api/v1/books`;
    return axios.post<IBackendResponse<IBook>>(url, data);
}

export const UpdateBookApi = (data: {
    id: number;
    mainTest: string;
    author: string;
    price: number;
    quantity: number;
    category: string;
    thumbnail: string;
    slider: string[];
}) => {
    const url = `/api/v1/books/${data.id}`;
    return axios.put<IBackendResponse<IBook>>(url, data);
}

export const DeleteBookApi = (id: number) => {
    const url = `/api/v1/books/${id}`;
    return axios.delete<IBackendResponse<null>>(url);
}

export const callUploadFileApi = (fileImg: any, type: string) => {
    const bodyFromData = new FormData();
    bodyFromData.append('fileImg', fileImg);
    const url = `/api/v1/file/upload`;
    return axios<IBackendResponse<string[]>>({
        url,
        method: "POST",
        data: bodyFromData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": type
        }
    });
}

export const CreateOrderApi = (data: {
    name: string;
    address: string;
    phone: string;
    type: string;
    totalPrice: number;
    detail: any;
}) => {
    const url = `/api/v1/orders`;
    return axios.post<IBackendResponse<string>>(url, data, {
        headers: {
            delay: 100
        }
    });
}

export const FetchHistoryApi = () => {
    const url = `/api/v1/history`;
    return axios.get<IBackendResponse<IHistory[]>>(url);
}

export const updateUserInfoApi = (data: {
    id: number;
    fullName: string;
    phone: string;
    img: string;
}) => {
    const url = `/api/v1/user`;
    return axios.put<IBackendResponse<string>>(url, data);
}

export const updateUserPasswordApi = (data: {
    currentPassword: string;
    newPassword: string;
}) => {
    const url = `/api/v1/user/change-password`;
    return axios.put<IBackendResponse<string>>(url, data);
}

export const getDashboardApi = () => {
    const url = `/api/v1/database/dashboard`;
    return axios.get<IBackendResponse<{
        countUser: number,
        countOrder: number,
        countBook: number
    }>>(url);
}

export const verifyEmail = (token: string) => {
    const url = `/api/v1/confirm-email`;
    return axios.get<IBackendResponse<string>>(url, {
        params: { token }
    });
}


export const resetPasswordOTPEmail = (email: string) => {
    const url = `/api/v1/resetPasswordOTPEmail`;
    return axios.get<IBackendResponse<string>>(url, { params: email })
}
export const verifyOTP = (email: string, otp: string) => {
    const url = `/api/v1/emailOTPVerification`;
    return axios.get<IBackendResponse<string>>(url, { params: { email, otp } });
}

export const resetPassword = (email: string, newPassword: string) => {
    const url = `/api/v1/reset-password`;
    return axios.post<IBackendResponse<string>>(url, { email, newPassword });
}

export const getRefreshToken = () => {
    const url = `/api/v1/auth/refresh`;
    return axios.get<IBackendResponse<ILogin>>(url);
}

export const createdVNPayUrl = (data: { amount: string }) => {
    const url = `/api/v1/vnpay`;

    return axios.post<string>(url, data);
}


