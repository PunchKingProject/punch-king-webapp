import { useState } from "react";
import Swal from "sweetalert2";

import LicensePlanTable from "../components/LicensePlanTable";
import LicensePlanModal from "../components/LicensePlanModal";
import DeleteLicenseDialog from "../components/DeleteLicenseDialog";

import {
    useLicensePlans,
    useCreateLicensePlan,
    useUpdateLicensePlan,
    useDeleteLicensePlan,
    LicensePlan,
} from "../api/licensePlan.api";

export default function LicensingPage() {

    const { data = [], isLoading } = useLicensePlans();

    const createPlan = useCreateLicensePlan();
    const updatePlan = useUpdateLicensePlan();
    const deletePlan = useDeleteLicensePlan();

    const [openModal, setOpenModal] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selected, setSelected] =
        useState<LicensePlan | null>(null);

    const handleCreate = () => {
        setSelected(null);
        setOpenModal(true);
    };

    const handleEdit = (plan: LicensePlan) => {
        setSelected(plan);
        setOpenModal(true);
    };

    const handleDeleteClick = (plan: LicensePlan) => {
        setSelected(plan);
        setDeleteOpen(true);
    };

    const handleSave = async (values: any) => {

        try {

            if (selected) {

                await updatePlan.mutateAsync({
                    id: selected.id,
                    ...values,
                });

                Swal.fire(
                    "Success",
                    "License Plan updated successfully",
                    "success"
                );

            } else {

                await createPlan.mutateAsync(values);

                Swal.fire(
                    "Success",
                    "License Plan created successfully",
                    "success"
                );

            }

            setOpenModal(false);

        } catch (err: any) {

            Swal.fire(
                "Error",
                err?.response?.data?.message ??
                    "Something went wrong",
                "error"
            );

        }

    };

    const confirmDelete = async () => {

        if (!selected) return;

        try {

            await deletePlan.mutateAsync(selected.id);

            Swal.fire(
                "Deleted",
                "License Plan deleted successfully",
                "success"
            );

            setDeleteOpen(false);

        } catch (err: any) {

            Swal.fire(
                "Error",
                err?.response?.data?.message ??
                    "Unable to delete",
                "error"
            );

        }

    };

    return (
        <>
            <LicensePlanTable
                data={data}
                loading={isLoading}
                onAdd={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <LicensePlanModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                edit={selected}
                onSubmit={handleSave}
            />

            <DeleteLicenseDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onDelete={confirmDelete}
            />
        </>
    );

}