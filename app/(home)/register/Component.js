'use client'

import { Box, Button, CircularProgress, OutlinedInput, Typography } from "@mui/material";

import { useState, useEffect } from "react";

import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';

import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { postRequestHandler } from "@/Components/requestHandler";
import { useFormik } from "formik";

console.log('login page called')

export default function Register() {
    const router = useRouter()


    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required'),
            fullName: Yup.string().required('Required'),
            phone: Yup.string().required('Required'),
        }),
        onSubmit: async value => {
            const body = { email: value?.email, password: value?.password, fullName: value?.fullName, phone: value?.phone }

            console.log('submitting', value, body);

            await postRequestHandler({
                route: '/api/register', body: body,
                successCallback: body => {
                    const result = body?.result;
                    console.log('result', result)
                    let message = ''
                    if (result) {
                        console.log('logged in');
                        router.replace('/');
                        message = 'Login successful!!'
                        window?.parent?.postMessage({ success: true }, '*')
                    }
                    else {
                        console.log('invalid login data');
                        message = body?.error
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

    const updateState = (newValue) => {
        return setState((previousValue) => { return { ...previousValue, ...newValue } });
    };


    useEffect(() => {
        router.prefetch('/receive-otp')
    }, [])
    //generate unique name for text field
    let nameValue = uuid()

    const Img = styled('img')({
        display: 'block',
        margin: 'auto'
    });


    const gotoLogin = () => {
        router.push('/login')
    }



    const label = ({ label, color, align }) => {
        return <Typography sx={{
            color: color ?? '#333333', textAlign: align ?? 'inherit',
            fontWeight: 700, fontSize: { xs: 12, md: 14 }, lineHeight: '24.51px'
        }}>
            {label}
        </Typography>
    }

    const textField = ({ nameValue, id, type, placeholder }) => {
        return <Box>
            <OutlinedInput fullWidth variant="outlined" id={id}
                placeholder={placeholder} type={type} sx={{ fontSize: 14, fontWeight: 500 }}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                value={formik.values[id]}
            />
            {formik.touched[id] && formik.errors[id] ? (
                <div>{formik.errors[id]}</div>
            ) : null}
        </Box>
    }

    return (
        <Box sx={{ maxWidth: '100%', }}>
            {state.message && label({ label: state.message, color: 'primary.main', align: 'center' })}

            <form onSubmit={formik.handleSubmit}>
                <Box sx={{ mb: 3, mt: 1 }}>
                    {label({ label: 'Full name' })}
                    {textField({
                        nameValue: nameValue, id: 'fullName', type: 'text',
                        placeholder: 'eg. John David'
                    })}
                </Box>

                <Box>
                    {label({ label: 'Phone Number' })}
                    {textField({
                        nameValue: nameValue, id: 'phone', type: 'text',
                        placeholder: 'eg. 08011112222'
                    })}
                </Box>

                <Box sx={{ mb: 3, mt: 1 }}>
                    {label({ label: 'Email' })}
                    {textField({
                        nameValue: nameValue, id: 'email', type: 'email',
                        placeholder: 'eg. bit@example.com'
                    })}
                </Box>

                <Box>
                    {label({ label: 'Password' })}
                    {textField({
                        nameValue: nameValue, id: 'password', type: 'password',
                        placeholder: 'Password'
                    })}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button id='forgotPswd' variant="text" sx={{
                        color: '#BF0606', fontWeight: 600, fontSize: 12,
                        lineHeight: '24.51px'
                    }}
                        onClick={gotoLogin}>
                        Login instead?
                    </Button>
                </Box>


                <Button id='regiterSubmit' type="submit" disabled={formik.isSubmitting}
                    fullWidth variant="contained" size='large' sx={{
                        bgcolor: '#BF0606', mt: 2,
                        fontWeight: 700, fontSize: 16,
                    }} >
                    {formik.isSubmitting && <CircularProgress id='regiterSubmit' size={20}
                        sx={{ mr: 2, color: '#08e8de' }} />}
                    Register
                </Button>
            </form>

        </Box>

    );
}
