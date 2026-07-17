import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { deleteLicensePlan } from "../api/licensePlan.api";

export function useDeleteLicensePlan() {

    const queryClient = useQueryClient();

    return useMutation({

        mutationFn: deleteLicensePlan,

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ["license-plans"],
            });
        },

    });

}