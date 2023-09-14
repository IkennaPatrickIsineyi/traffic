'use client'

import { Box, Button, CircularProgress, OutlinedInput, Typography } from "@mui/material";

import { useState, useEffect, useContext } from "react";

import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';

import styled from "@emotion/styled";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { postRequestHandler } from "@/Components/requestHandler";
import { useFormik } from "formik";
import moment from "moment";
import AppContext from "@/Components/appContext";

console.log('login page called')

export default function AddTrafficOffence() {
    const router = useRouter()
    const path = usePathname();
    const params = useSearchParams();

    const currentPath = path.split('/')[2]

    const type = params.get('type') ?? 'accidents'

    const formik = useFormik({
        initialValues: { date: moment().format('yyyy-MM-DD'), plateNumber: '', category: '', location: '', details: '' },
        validationSchema: Yup.object({
            date: Yup.string().required('Required'),
            plateNumber: Yup.string().required('Required'),
            location: Yup.string().required('Required'),
            category: Yup.string().required('Required'),
            details: Yup.string().required('Required'),
        }),
        onSubmit: async value => {
            const body = {
                date: value?.date, plateNumber: value?.plateNumber, location: value?.location, details: value?.details,
                category: value?.category
            }

            console.log('submitting', value, body);

            await postRequestHandler({
                route: `/api/add-incidence`, body: { ...body, type: currentPath },
                successCallback: body => {
                    const result = body?.result;
                    console.log('result', result)
                    let message = ''
                    if (result) {
                        console.log('saved data');
                        // router.replace('/');
                        message = 'Report saved';
                        formik.resetForm()
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

    const [state, setState] = useState({
        email: { value: '', errMsg: '' }, password: { value: '', errMsg: '' },
        showPassword: false, message: ''
    });

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
                Create New Traffic Violation Record
            </Typography>

            {state.message && label({ label: state.message, color: 'primary.main', align: 'center' })}

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

            </form>

        </Box>

    );
}
