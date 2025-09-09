
import AppHeader from "components/layout/app.header";
import { useState } from "react";
import { Outlet } from "react-router-dom";



const Layout = () => {
    const [search, setSearch] = useState("");
    return (
        <>
            <AppHeader
                search={search}
                setSearch={setSearch}
            />
            <Outlet context={[search, setSearch]} />
        </>

    )
}

export default Layout;
