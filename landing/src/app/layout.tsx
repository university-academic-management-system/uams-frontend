import { Toaster } from "@components/ui/toaster";
import useAuthStore from "@stores/auth.store";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

const RootLayout = () => {
    const { token, user } = useAuthStore();
    const path = useLocation().pathname;
    const navigate = useNavigate();

    useEffect(() => {
        if ((!token || user) && path.startsWith("/auth")) {
            navigate("/");
        }
    }, [token, user, path,navigate]);

    return <>
        <Outlet />
        <Toaster />
    </>


}


export default RootLayout;