import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, type DashboardStatsParams } from "../api/dashboard";


export function useDashboardStats(params:DashboardStatsParams) {
    return useQuery({
        queryKey: ['dashboardStats', params], //refetch when date changes
        queryFn: () => getDashboardStats(params),
        staleTime: 60_000, //1 min
    })
}