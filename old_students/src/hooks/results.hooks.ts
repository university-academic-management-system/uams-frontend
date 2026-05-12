import ResultsServices from "@/services/results.services";
import { useQuery } from "@tanstack/react-query";

const ResultsHooks = {
    useResults: () => {
        return useQuery({
            queryKey: ['results'],
            queryFn: ResultsServices.getResults,
        })
    }
}

export default ResultsHooks;