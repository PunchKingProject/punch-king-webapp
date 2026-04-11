import { useQuery } from "@tanstack/react-query"
import {type  SingleUserStats, type UseSingleUserStatsArgs } from "../api/users.types.ts"
import { apiGetSingleUsersStats } from "../api/users.api.ts";


export const useSingleUserStats = ({sponsor_id, start_date, end_date}: UseSingleUserStatsArgs) => {

    return useQuery<SingleUserStats>({
      queryKey: ['singleUserStats', { sponsor_id, start_date, end_date }],
      queryFn: () =>
        apiGetSingleUsersStats({ sponsor_id, start_date, end_date }),
      enabled: !!sponsor_id, // don’t run until we have an id
    });
}