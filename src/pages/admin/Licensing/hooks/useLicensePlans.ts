import { useQuery } from "@tanstack/react-query";
import { fetchLicensePlans } from "../api/license.api";

export function useLicensePlans(){

    return useQuery({
        queryKey:["license-plans"],
        queryFn:fetchLicensePlans
    });

}