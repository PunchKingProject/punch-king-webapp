import api from "@/lib/api";

export interface LicensePlan {
    id: number;
    name: string;
    description: string;
    price: number;
    currency: string;
    duration: number;
}

export interface CreateLicensePlanDTO {
    name: string;
    description: string;
    price: number;
    currency: string;
    duration: number;
}

export interface UpdateLicensePlanDTO
    extends CreateLicensePlanDTO {
    id: number;
}

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

export const getLicensePlans = async () => {
    const res = await api.get("/license/plans");
    return res.data.data;
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const createLicensePlan = async (
    payload: CreateLicensePlanDTO
) => {
    const res = await api.post(
        "/license/plans",
        payload
    );

    return res.data.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export const updateLicensePlan = async (
    payload: UpdateLicensePlanDTO
) => {
    const res = await api.patch(
        `/license/plans/${payload.id}`,
        payload
    );

    return res.data.data;
};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteLicensePlan = async (
    id: number
) => {
    const res = await api.delete(
        `/license/plans/${id}`
    );

    return res.data;
};