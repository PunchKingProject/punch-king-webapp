import { customFetch } from "../../../../Axios";
import type {
    LicensePlan,
    LicensePlansResponse,
    CreateLicensePlanPayload,
    UpdateLicensePlanPayload
} from "./types";

export async function fetchLicensePlans(): Promise<LicensePlan[]> {
    const { data } =
        await customFetch.get<LicensePlansResponse>(
            "/license/plans"
        );

    return data.data;
}

export async function createLicensePlan(
    body: CreateLicensePlanPayload
) {
    const { data } =
        await customFetch.post(
            "/license/plan",
            body
        );

    return data;
}

export async function updateLicensePlan(
    id:number,
    body:UpdateLicensePlanPayload
){
    const { data } =
        await customFetch.patch(
            `/license/plan/${id}`,
            body
        );

    return data;
}

export async function deleteLicensePlan(
    id:number
){
    const { data } =
        await customFetch.delete(
            `/license/plan/${id}`
        );

    return data;
}