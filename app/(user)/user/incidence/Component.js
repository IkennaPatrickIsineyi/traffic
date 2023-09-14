'use client'

import AppContext from "@/Components/appContext";
import {
    Box, IconButton, OutlinedInput, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from "@mui/material";

import { useContext, useEffect, useState, } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getRequestHandler } from "@/Components/requestHandler";
import moment from "moment";

export default function Incidence({ pageName, headings, hideAddButton }) {
    const router = useRouter()
    const path = usePathname();
    const params = useSearchParams()

    headings = headings ?? ['S/N', 'Date', 'Plate Number', 'Location', 'Casualties', 'Degree', 'Details', 'Delete', 'Edit']

    const [state, setState] = useState({
        incidence: {}
    });


    const { sharedData, updateSharedData } = useContext(AppContext);

    const currentPath = path.split('/')[2] ?? 'accidents'
    const incidenceId = params.get('id')
    const incidenceType = params.get('type')

    const updateState = (newValue) => {
        return setState((previousValue) => { return { ...previousValue, ...newValue } });
    };

    useEffect(() => {
        updateSharedData({ pageTitle: incidenceType ?? 'Accidents' /* 'Accidents' */ });

        //Get the incidence
        getRequestHandler({
            route: `/api/get-incidence?type=${incidenceType}&&id=${incidenceId}`,
            successCallback: body => {
                console.log('body', body)
                if (body?.result)
                    updateState({ incidence: body?.result })
            },
            errorCallback: err => {
                console.log("something went wrong in admin's incidence", err)
            }
        })
    }, [])

    const ValueComponent = ({ field, value }) => {
        return <Box sx={{ display: 'block', mb: 2 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                {field}
            </Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 400 }}>
                {value}
            </Typography>
        </Box>
    }

    return (
        <Box sx={{}}>
            {/* Heading */}
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F5F5F5', px: 2, py: 1 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 600, textTransform: 'capitalize' }}>
                    Detail of The Incidence
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

            </Box>

            {/* List of events */}
            <Box sx={{ px: 2, py: 3 }}>
                {state.incidence?.date && <ValueComponent value={moment(state.incidence?.date).format('DD-MM-yyyy')} field='Date' />}

                {state.incidence?.location && <ValueComponent value={state.incidence?.location} field='Location' />}
                {state.incidence?.casualties && <ValueComponent value={state.incidence?.casualties} field='Number of Casualties' />}
                {state.incidence?.degree && <ValueComponent value={state.incidence?.degree} field='Degree of Accident' />}
                {state.incidence?.plateNumber && <ValueComponent value={state.incidence?.plateNumber} field='Plate Number of Vehicle' />}
                {state.incidence?.details && <ValueComponent value={state.incidence?.details} field='Details' />}

            </Box>

        </Box >
    );
} 