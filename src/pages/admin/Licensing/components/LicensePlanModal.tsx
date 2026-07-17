import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
} from "@mui/material";

import { useEffect, useState } from "react";

import { LicensePlan } from "../api/licensePlan.api";

interface Props {

    open:boolean;

    onClose():void;

    onSubmit(data:any):void;

    edit?:LicensePlan|null;

}

export default function LicensePlanModal({

    open,

    onClose,

    onSubmit,

    edit,

}:Props){

    const [form,setForm]=useState({

        name:"",

        description:"",

        price:0,

        currency:"USD",

        duration:365,

    });

    useEffect(()=>{

        if(edit){

            setForm(edit);

        }

    },[edit]);

    return(

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>

                {edit?"Edit":"Create"} License Plan

            </DialogTitle>

            <DialogContent>

                <Stack spacing={2} mt={2}>

                    <TextField
                        label="Name"
                        value={form.name}
                        onChange={(e)=>setForm({...form,name:e.target.value})}
                    />

                    <TextField
                        label="Description"
                        multiline
                        rows={3}
                        value={form.description}
                        onChange={(e)=>setForm({...form,description:e.target.value})}
                    />

                    <TextField
                        label="Price"
                        type="number"
                        value={form.price}
                        onChange={(e)=>setForm({...form,price:Number(e.target.value)})}
                    />

                    <TextField
                        label="Currency"
                        value={form.currency}
                        onChange={(e)=>setForm({...form,currency:e.target.value})}
                    />

                    <TextField
                        label="Duration"
                        type="number"
                        value={form.duration}
                        onChange={(e)=>setForm({...form,duration:Number(e.target.value)})}
                    />

                </Stack>

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={()=>onSubmit(form)}
                >
                    Save
                </Button>

            </DialogActions>

        </Dialog>

    )

}