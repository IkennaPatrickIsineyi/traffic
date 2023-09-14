'use client'

import AppContext from "@/Components/appContext";
import {
    Box, Button, CircularProgress, IconButton, OutlinedInput, Typography
} from "@mui/material";

import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add'


import { useContext, useEffect, useState, } from "react";
import { useFormik } from "formik";
import { usePathname, useRouter } from "next/navigation";
import { getRequestHandler } from "@/Components/requestHandler";

export default function IncidenceFinder({ pageName, }) {
    const router = useRouter();
    const path = usePathname()

    const [state, setState] = useState({
        incidence: {}, view: 'form', message: ''
    });

    const { sharedData, updateSharedData } = useContext(AppContext);

    const currentPath = path.split('/')[2] ?? 'accidents'

    useEffect(() => {
        updateSharedData({ pageTitle: pageName ?? 'Accidents' })
    }, [])

    const updateState = (newValue) => {
        return setState((previousValue) => { return { ...previousValue, ...newValue } });
    };

    const addEvent = () => {
        router.push(`/user/${currentPath}/add-event`)
    }

    const gotoIncidence = (id) => {
        router.push(`/user/incidence?id=${id}&&type=${currentPath}`)
    }

    const formik = useFormik({
        initialValues: { plateNumber: '' },
        validationSchema: Yup.object({
            plateNumber: Yup.string().required('Required'),
        }),
        onSubmit: async value => {
            const body = {
                plateNumber: value?.plateNumber,
            }

            console.log('submitting', value, body);

            updateState({ message: '' });

            await getRequestHandler({
                route: `/api/get-incidence-by-licence?type=${currentPath}&&plateNumber=${value.plateNumber}`,
                successCallback: body => {
                    const result = body?.result;
                    console.log('result', result)
                    let message = ''
                    if (result) {
                        console.log('incidence found');
                        gotoIncidence(result)
                    }
                    else {
                        message = 'No record found'
                    }

                    updateState({ message: message })
                },
                errorCallback: err => {
                    console.log('something went wrong', err)
                    updateState({ message: 'Try again later' })
                }
            })
        }
    })


    return (
        <Box sx={{}}>
            {/* Heading */}
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F5F5F5', px: 2, py: 1 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                    {pageName ?? 'Accident'} Finder
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {<IconButton sx={{ bgcolor: 'primary.main', color: 'white' }}
                    title={`report ${currentPath}`} onClick={addEvent}>
                    <AddIcon />
                </IconButton>}
            </Box>

            <Box sx={{ px: 4, py: 2, }}>
                <Typography sx={{ fontSize: 20, fontWeight: 600, mb: 2 }}>
                    Find {pageName ?? 'Accidents'} By Vehicle Licence Plate Number
                </Typography>

                <form onSubmit={formik.handleSubmit}>
                    <Typography sx={{
                        color: '#333333', textAlign: 'inherit',
                        fontWeight: 700, fontSize: { xs: 12, md: 14 }, lineHeight: '24.51px'
                    }}>
                        Licence Plate Number {state.message && `(${state.message})`}
                    </Typography>

                    <OutlinedInput variant="outlined" id={'plateNumber'}
                        placeholder={'Licence Plate Number'} type={'text'} sx={{ width: '300px', fontSize: 14, fontWeight: 500 }}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        value={formik.values.plateNumber}
                    />
                    {formik.touched.plateNumber && formik.errors.plateNumber ? (
                        <div>{formik.errors.plateNumber}</div>
                    ) : null}

                    <Box  >
                        <Button id='submit' type="submit" disabled={formik.isSubmitting}
                            variant="contained" size='large' sx={{
                                bgcolor: '#BF0606', mt: 2, width: '100px',
                                fontWeight: 700, fontSize: 16, mx: 'auto'
                            }} >
                            {formik.isSubmitting && <CircularProgress id='loginSubmit' size={20}
                                sx={{ mr: 2, color: '#08e8de' }} />}
                            Search
                        </Button>
                    </Box>

                </form>

            </Box>

        </Box >
    );
} 