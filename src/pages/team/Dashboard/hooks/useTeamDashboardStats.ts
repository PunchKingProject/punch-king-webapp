import { useQuery } from "@tanstack/react-query";
import {type DashboardStats, type DashboardStatsParams } from "../api/dashboard.types.ts";
import { getDashboardStats } from "../api/dashboard.api.ts";


export function useTeamDashboardStats(params:DashboardStatsParams) {
    return useQuery<DashboardStats>({
        queryKey: ['dashboardStats', params], //refetch when date changes
        queryFn: () => getDashboardStats(params),
        staleTime: 60_000, //1 min
    }
    )
}