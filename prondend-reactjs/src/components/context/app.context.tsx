import { createContext, useContext, useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import { FetchAccountApi } from "services/api";

interface IAppContext {
    isAuthenticated: boolean;
    user: IUser | null;
    isLoading: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setUser: (user: IUser | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    cart: ICart[];
    setCart: (cart: ICart[]) => void;
}

const CustomContext = createContext<IAppContext | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [cart, setCart] = useState<ICart[]>([]);


    useEffect(() => {
        const fetchAccount = async () => {
            const res = await FetchAccountApi();
            const cart = localStorage.getItem('cart');
            if (res.data) {
                setUser(res.data);
                setIsAuthenticated(true)
                if (cart) {
                    setCart(JSON.parse(cart));
                }
            }
            setIsLoading(false)
        }
        fetchAccount();

    }, []);

   
    return (
        <>
            {
                isLoading === true ?
                    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                        <HashLoader
                            color="#1890ff"
                            size={50}
                        />
                    </div>
                    :
                    <CustomContext.Provider value={{ isAuthenticated, user, isLoading, setIsAuthenticated, setUser, setIsLoading, cart, setCart }}>
                        {children}
                    </CustomContext.Provider>
            }
        </>
    )
}

export const useAppContext = () => {
    const context = useContext(CustomContext);
    if (!context) {
        throw new Error('useAppContext must be used within a AppContext');
    }
    return context;
}
