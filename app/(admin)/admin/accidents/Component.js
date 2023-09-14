'use client'

import AppContext from "@/Components/appContext";
import {
    Box, IconButton, OutlinedInput, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import { useContext, useEffect, useState, } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getRequestHandler } from "@/Components/requestHandler";
import moment from "moment";

export default function Accidents({ pageName, headings, hideAddButton }) {
    const router = useRouter()
    const path = usePathname();

    headings = headings ?? ['S/N', 'Date', 'Plate Number', 'Location', 'Casualties', 'Degree', 'Details', 'Delete', 'Edit']
    const events = [
        { id: 1, date: '2023-12-2020', plateNumber: 'BXO-SFA-12', location: 'Sapele Road', casualities: 2, degree: 'major', details: 'Lots of blood' },
        { id: 2, date: '2023-12-2021', plateNumber: 'BXO-SeA-12', location: 'Ogheghe Road', casualities: 5, degree: 'minoe', details: 'Lots of blood' },
        { id: 3, date: '2023-12-2010', plateNumber: 'BEO-SFA-12', location: 'Agbor Road', casualities: 6, degree: 'minor', details: 'Lots of blood' },
        { id: 4, date: '2023-10-2010', plateNumber: 'BXO-SFA-10', location: 'Winners Road', casualities: 1, degree: 'major', details: 'Lots of blood' },
    ]
    const [state, setState] = useState({
        currentTab: 0, numberOfAccidents: 20, events: []
    });

    const { sharedData, updateSharedData } = useContext(AppContext);

    const currentPath = path.split('/')[2] ?? 'accidents'

    const updateState = (newValue) => {
        return setState((previousValue) => { return { ...previousValue, ...newValue } });
    };

    useEffect(() => {
        updateSharedData({ pageTitle: pageName ?? 'Accidents' /* 'Accidents' */ });
        router.prefetch(`/admin/${currentPath}/add-event`)

        //Get all the accidents
        getRequestHandler({
            route: `/api/get-incidence-list?type=${currentPath}`,
            successCallback: body => {
                console.log('body', body)
                if (body?.result)
                    updateState({ events: body?.result })
            },
            errorCallback: err => {
                console.log("something went wrong in admin's incidence", err)
            }
        })
    }, [])

    const handleDeleteIncidence = (id) => {
        if (id) {
            getRequestHandler({
                route: `/api/delete-incidence?type=${currentPath}&&id=${id}`,
                successCallback: body => {
                    console.log('body', body)
                    if (body?.result) { }
                    updateState({ events: state.events.filter(item => item?._id !== id) })
                },
                errorCallback: err => {
                    console.log("something went wrong in admin's incidence", err)
                }
            })
        }
    }

    const handleEditIncidence = (id) => {
        if (id)
            router.push(`/admin/${currentPath}/edit-event?id=${id}`)
    }

    const addEvent = () => {
        router.push(`/admin/${currentPath}/add-event`)
    }


    return (
        <Box sx={{}}>
            {/* Heading */}
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F5F5F5', px: 2, py: 1 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    Reported {pageName ?? 'Accidents'} ({state.events.length})
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {/* Search box */}
                <OutlinedInput placeholder="Plate number..." sx={{
                    height: 40, mr: 4, width: 400
                }} />

                {!hideAddButton && <IconButton sx={{ bgcolor: 'primary.main', color: 'white' }}
                    title="add accident" onClick={addEvent}>
                    <AddIcon />
                </IconButton>}
            </Box>

            {/* List of events */}
            <Table>
                <TableHead>
                    <TableRow>
                        {headings.map((item, index) => {
                            return <TableCell key={index} sx={{ fontWeight: 600 }}>
                                {item}
                            </TableCell>
                        })}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {state.events.map((item, parentIndex) => {
                        const arr = Object.values(item)
                        return <TableRow>
                            <TableCell  >
                                {parentIndex + 1}
                            </TableCell>

                            <TableCell  >
                                {moment(item.date).format('DD-MM-yyyy')}
                            </TableCell>

                            {arr.slice(2, Array.length - 2).map((cell, index) => {
                                return <TableCell key={index} sx={{ maxWidth: 100 }}>
                                    {cell}
                                </TableCell>
                            })}

                            {/* Delete icon */}
                            <TableCell >
                                <DeleteIcon onClick={() => { handleDeleteIncidence(item?._id) }}
                                    sx={{ cursor: 'pointer' }} />
                            </TableCell>

                            {/* Edit icon */}
                            <TableCell>
                                <EditIcon onClick={() => { handleEditIncidence(item?._id) }} sx={{ cursor: 'pointer' }} />
                            </TableCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>

        </Box >
    );
} 