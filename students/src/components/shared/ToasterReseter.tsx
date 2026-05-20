import { toaster } from "@components/ui/toaster";
import { useEffect } from "react";
import { useLocation } from "react-router"

const ToasterReseter = () => {
    const loc = useLocation().pathname;
    useEffect(() => {
        toaster.dismiss();
    }, [loc])
    return null;
}

export default ToasterReseter;