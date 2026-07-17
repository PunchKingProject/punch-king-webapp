import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

interface Props{

    open:boolean;

    onClose():void;

    onDelete():void;

}

export default function DeleteLicenseDialog({

    open,

    onClose,

    onDelete,

}:Props){

    return(

        <Dialog open={open} onClose={onClose}>

            <DialogTitle>

                Delete License Plan

            </DialogTitle>

            <DialogContent>

                Are you sure you want to delete this plan?

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={onDelete}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>

    )

}