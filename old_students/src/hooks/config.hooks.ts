import ConfigServices from "@/services/configs.services";
import { useQuery } from "@tanstack/react-query";

const ConfigsHooks = {
    useConfigs: () => {
        return useQuery({
            queryKey: ['configs'],
            queryFn: ConfigServices.getConfigs,
        })
    }
}

export default ConfigsHooks;