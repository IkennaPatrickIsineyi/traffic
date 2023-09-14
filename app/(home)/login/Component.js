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

export default function Login() {
    const router = useRouter()


    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required')
        }),
        onSubmit: async value => {
            const body = { email: value?.email, password: value?.password }

            console.log('submitting', value, body);

            await postRequestHandler({
                route: '/api/login', body: body,
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
                        message = 'Your email or password is invalid'
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

    const buttonActive = (id) => {
        return true//disabledButtons.includes(id);
    }

    const gotoForgotPassword = () => {
        router.push('/receive-otp')
    }

    const gotoRegister = () => {
        router.push('/register')
    }

    const handleEmail = (event) => {
        updateState({ email: { errMsg: '', value: event.target.value }, message: '' })
    }

    const handlePassword = (event) => {
        updateState({ password: { errMsg: '', value: event.target.value }, message: '' })
    }


    const signIn = (buttonId) => {
        const { email, password } = state;
        updateState({ message: '' })

        if (email.value && password.value) {
            //  startAnimation(buttonId, dispatch)

            const body = { email: email.value, password: password.value }

            const formData = new FormData();

            Object.keys(body).forEach(key => formData.append(key, body[key]))

            postRequestHandler({
                route: '/api/login', body: body,
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
                        message = 'Your email or password is invalid'
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
        else {
            updateState({ message: 'Email and password are required' })
        }
    }

    const handleSubmit = (event) => {
        console.log('handle submit');

        signIn(event.target.id)
    }

    const validate = (event) => {
        const id = event.currentTarget.id;
        if (!event.currentTarget.value) {
            updateState({ [id]: { value: event.currentTarget.value, errMsg: 'Required' } })
        }
        else if (id === 'email') {
            return (emailPattern.test(event.currentTarget.value)) ? true
                :
                updateState({ [id]: { ...state[id], errMsg: 'Invalid email' } })
        }
    }

    const emailPattern = /^([\w|+|\-|_|~|\.])+[@]([\w])+\.[a-z]+$/i;

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
                    {label({ label: 'Email' })}
                    {textField({
                        nameValue: nameValue, id: 'email', type: 'email',
                        onchange: handleEmail, onblur: validate, placeholder: 'eg. bit@example.com'
                    })}
                </Box>

                <Box>
                    {label({ label: 'Password' })}
                    {textField({
                        nameValue: nameValue, id: 'password', type: 'password',
                        onchange: handlePassword, placeholder: 'Password'
                    })}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button id='forgotPswd' variant="text" sx={{
                        color: '#BF0606', fontWeight: 600, fontSize: 12,
                        lineHeight: '24.51px'
                    }}
                        onClick={gotoForgotPassword}>
                        Forgot Password?
                    </Button>
                </Box>


                <Button id='loginSubmit' type="submit" disabled={formik.isSubmitting}
                    fullWidth variant="contained" size='large' sx={{
                        bgcolor: '#BF0606', mt: 2,
                        fontWeight: 700, fontSize: 16,
                    }} >
                    {formik.isSubmitting && <CircularProgress id='loginSubmit' size={20}
                        sx={{ mr: 2, color: '#08e8de' }} />}
                    Login
                </Button>
            </form>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button id='register' variant="text" sx={{
                    color: '#BF0606', fontWeight: 600, fontSize: 12,
                    lineHeight: '24.51px'
                }}
                    onClick={gotoRegister}>
                    Register
                </Button>
            </Box>

        </Box>

    );
}
