import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { createLicensePlan } from "../api/licensePlan.api";

export function useCreateLicensePlan() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: createLicensePlan,

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["license-plans"],
            });
        },

    });

}