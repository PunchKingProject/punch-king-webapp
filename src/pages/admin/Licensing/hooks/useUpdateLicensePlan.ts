import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { updateLicensePlan } from "../api/licensePlan.api";

export function useUpdateLicensePlan() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: updateLicensePlan,

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["license-plans"],
            });
        },

    });

}