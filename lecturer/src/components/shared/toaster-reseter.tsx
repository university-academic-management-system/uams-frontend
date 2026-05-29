import { toaster } from "@components/ui/toaster";
import { useEffect } from "react"
import { useLocation } from "react-router"

const ToasterReseter = () => {
    const pathname = useLocation().pathname;
    useEffect(() => {
        toaster.dismiss()
        toaster.remove()
    }, [pathname]);

    return null;
}

export default ToasterReseter;