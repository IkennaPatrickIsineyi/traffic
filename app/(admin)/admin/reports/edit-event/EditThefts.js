'use client'

import { Box, Button, CircularProgress, OutlinedInput, Typography } from "@mui/material";

import { useState, useEffect, useContext } from "react";

import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';

import styled from "@emotion/styled";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getRequestHandler, postRequestHandler } from "@/Components/requestHandler";
import { useFormik } from "formik";
import moment from "moment";
import AppContext from "@/Components/appContext";

console.log('login page called')

export default function EditTheft() {
    const router = useRouter()
    const path = usePathname();
    const params = useSearchParams();

    const [state, setState] = useState({
        email: { value: '', errMsg: '' }, password: { value: '', errMsg: '' },
        showPassword: false, message: '', existingData: null
    });

    const id = params.get('id');

    const currentPath = path.split('/')[2]

    useEffect(() => {
        //Get the record that has the id
        getRequestHandler({
            route: `/api/get-incidence?type=${currentPath}&&id=${id}`,
            successCallback: body => {
                if (body?.result) {
                    const data = body?.result;
                    updateState({ existingData: data })
                    formik.setValues({ ...data, date: moment(data.date,).format('yyyy-MM-DD') })
                }
            },
            errorCallback: err => {
                console.log("something went wrong in admin's edit event", err)
            }
        })
    }, [])


    const formik = useFormik({
        initialValues: {
            date: moment().format('yyyy-MM-DD'), plateNumber: '', location: '', details: '', degree: '',
            casualties: 0, category: '', reportType: ''
        },
        validationSchema: Yup.object({
            date: Yup.string().required('Required'),
            plateNumber: Yup.string().required('Required'),
            location: Yup.string().required('Required'),
            details: Yup.string().required('Required'),
            degree: Yup.string().required('Required'),
            casualties: Yup.string().required('Required'),
            category: Yup.string().required('Required'),
            reportType: Yup.string().required('Required'),
        }),
        onSubmit: async value => {
            const body = {
                date: value?.date, plateNumber: value?.plateNumber, location: value?.location, details: value?.details,
                degree: value?.degree, casualties: value?.casualties, category: value?.category, reportType: value?.reportType
            }

            console.log('submitting', value, body);

            await postRequestHandler({
                route: `/api/update-incidence`, body: { ...body, id: id, type: currentPath },
                successCallback: body => {
                    const result = body?.result;
                    console.log('result', result)
                    let message = ''
                    if (result) {
                        console.log('updated data');
                        // router.replace('/');
                        message = 'Update saved';
                    }
                    else {
                        console.log('error from backend');
                        message = 'Something went wrong'
                    }

                    // stopAnimation(buttonId, dispatch);
                    updateState({ message: message })
                },
                errorCallback: err => {
                    console.log('something went wrong', err)
                    updateState({ message: 'Try again later' })
                    //  stopAnimation(buttonId, dispatch)
                }
            })
        }
    })



    const { sharedData, updateSharedData } = useContext(AppContext);
    const updateState = (newValue) => {
        return setState((previousValue) => { return { ...previousValue, ...newValue } });
    };

    useEffect(() => {
        updateSharedData({ pageTitle: 'Accidents' });
    }, [])

    let nameValue = uuid()

    const label = ({ label, color, align }) => {
        return <Typography sx={{
            color: color ?? '#333333', textAlign: align ?? 'inherit',
            fontWeight: 700, fontSize: { xs: 12, md: 14 }, lineHeight: '24.51px'
        }}>
            {label}
        </Typography>
    }

    const textField = ({ nameValue, id, type, placeholder, multiline }) => {
        return <Box sx={{ mb: 2 }}>
            <OutlinedInput fullWidth variant="outlined" id={id}
                placeholder={placeholder} type={type} sx={{ fontSize: 14, fontWeight: 500 }}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                value={formik.values[id]} multiline={multiline} rows={5}
            />
            {formik.touched[id] && formik.errors[id] ? (
                <div>{formik.errors[id]}</div>
            ) : null}
        </Box>
    }

    return (
        <Box sx={{ maxWidth: '60%', mx: 'auto' }}>
            <Typography sx={{ my: 2, fontSize: 18, fontWeight: 700, textAlign: 'center' }}>
                Update Theft Record
            </Typography>

            {state.message && label({ label: state.message, color: 'primary.main', align: 'center' })}

            {state.existingData &&
                <form onSubmit={formik.handleSubmit}>
                    <Box sx={{ mb: 3, mt: 1 }}>
                        {label({ label: 'Date' })}
                        {textField({
                            nameValue: nameValue, id: 'date', type: 'date',
                        })}
                    </Box>

                    <Box>
                        {label({ label: 'Plate Number' })}
                        {textField({
                            nameValue: nameValue, id: 'plateNumber', type: 'text',
                            placeholder: 'Plate Number'
                        })}
                    </Box>
                    <Box>
                        {label({ label: 'Location' })}
                        {textField({
                            nameValue: nameValue, id: 'location', type: 'text',
                            placeholder: 'Location'
                        })}
                    </Box>
                    <Box>
                        {label({ label: 'Category' })}
                        {textField({
                            nameValue: nameValue, id: 'category', type: 'text',
                            placeholder: 'Category'
                        })}
                    </Box>
                    <Box>
                        {label({ label: 'Casualties' })}
                        {textField({
                            nameValue: nameValue, id: 'casualties', type: 'text',
                            placeholder: 'Casualties'
                        })}
                    </Box>
                    <Box>
                        {label({ label: 'Degree' })}
                        {textField({
                            nameValue: nameValue, id: 'degree', type: 'text',
                            placeholder: 'Degree'
                        })}
                    </Box>
                    <Box>
                        {label({ label: 'Report Type' })}
                        {textField({
                            nameValue: nameValue, id: 'reportType', type: 'text',
                            placeholder: 'Report Type'
                        })}
                    </Box>
                    <Box>
                        {label({ label: 'Details' })}
                        {textField({
                            nameValue: nameValue, id: 'details', type: 'text',
                            placeholder: 'Details', multiline: true
                        })}
                    </Box>

                    <Box align='center'>
                        <Button id='loginSubmit' type="submit" disabled={formik.isSubmitting}
                            variant="contained" size='large' sx={{
                                bgcolor: '#BF0606', mt: 2, width: '60%',
                                fontWeight: 700, fontSize: 16, mx: 'auto'
                            }} >
                            {formik.isSubmitting && <CircularProgress id='loginSubmit' size={20}
                                sx={{ mr: 2, color: '#08e8de' }} />}
                            submit
                        </Button>
                    </Box>

                </form>}

        </Box>

    );
}
