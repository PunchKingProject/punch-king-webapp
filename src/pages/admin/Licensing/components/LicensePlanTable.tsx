import {
    Button,
    IconButton,
    Stack,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    MaterialReactTable,
    useMaterialReactTable,
    MRT_ColumnDef,
} from "material-react-table";

import { LicensePlan } from "../api/licensePlan.api";

interface Props {
    data: LicensePlan[];
    loading: boolean;
    onEdit(plan: LicensePlan): void;
    onDelete(plan: LicensePlan): void;
    onAdd(): void;
}

export default function LicensePlanTable({
    data,
    loading,
    onEdit,
    onDelete,
    onAdd,
}: Props) {

    const columns: MRT_ColumnDef<LicensePlan>[] = [

        {
            accessorKey: "name",
            header: "Plan",
        },

        {
            accessorKey: "price",
            header: "Price",
        },

        {
            accessorKey: "currency",
            header: "Currency",
        },

        {
            accessorKey: "duration",
            header: "Duration (Days)",
        },

        {
            accessorKey: "description",
            header: "Description",
        },

        {
            id: "actions",
            header: "Actions",

            Cell: ({ row }) => (

                <Stack direction="row">

                    <IconButton
                        onClick={() => onEdit(row.original)}
                    >
                        <EditIcon />
                    </IconButton>

                    <IconButton
                        color="error"
                        onClick={() => onDelete(row.original)}
                    >
                        <DeleteIcon />
                    </IconButton>

                </Stack>

            ),
        },

    ];

    const table = useMaterialReactTable({

        columns,

        data,

        state: {
            isLoading: loading,
        },

        renderTopToolbarCustomActions: () => (

            <Button
                variant="contained"
                onClick={onAdd}
            >
                Add License Plan
            </Button>

        ),

    });

    return <MaterialReactTable table={table} />;

}