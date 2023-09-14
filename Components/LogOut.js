'use client'

import {
    Box, Button, CircularProgress, Modal, Typography,
} from "@mui/material";

const logoutImg = '/images/logout.png'

import { useContext, useState } from "react";
import { getRequestHandler } from "./requestHandler";
import { useRouter } from "next/navigation";
import AppContext from "./appContext";
import { useFormik } from "formik";

function LogOut() {
    const router = useRouter();

    const { sharedData, updateSharedData } = useContext(AppContext);

    //const disabledButtons = sharedData.route.disabledButtons;
    const showLogOutPrompt = sharedData.logOut;

    const [state, setState] = useState({
        adminProfileData: null
    });

    const handleCancel = () => {
        updateSharedData({ logOut: false })
        //  dispatch(closeLogoutPrompt());
    }

    const formik = useFormik({
        initialValues: { data: '' },
        onSubmit: async () => {

            await getRequestHandler({
                route: '/api/log-out',
                successCallback: body => {
                    const result = body.result;
                    console.log('logged out', result);
                    if (result) {
                        //user has been logged out. Close modal and send them to index page
                        router.replace('/login');
                        // router.refresh(); 

                        handleCancel();
                        //   stopAnimation(buttonId, dispatch);

                    }
                    else {
                        //Log out failed. Show error message
                        // stopAnimation(buttonId, dispatch);
                        handleCancel()
                    }
                },
                errorCallback: err => {
                    console.log('something went wrong', err);
                    // stopAnimation(buttonId, dispatch);
                }

            })
        }
    })




    return (
        <Modal open={showLogOutPrompt} onClose={handleCancel}>
            <Box sx={{
                width: '300px',
                bgcolor: 'white', p: 4, transform: 'translate(-50%,-50%)',
                position: 'absolute', top: '50%', left: '50%'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', }}>
                    <img alt='logout' src={logoutImg} height='100px' />
                </Box>

                <Typography align='center' sx={{
                    my: 4, fontSize: 14, fontWeight: 600,
                    lineHeight: '30px', textTransform: 'uppercase'
                }}>
                    You are about to log out from Lamid group Ware
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <form onSubmit={formik.handleSubmit}>
                        <input type="text" value='sds' value={formik.values.data} defaultValue={'dssd'} hidden />
                        <Button id='logoutProceed' variant='text' type='submit'
                            sx={{ fontSize: 18, fontWeight: 700, }}
                            //  onClick={() => { formik.handleSubmit({ 'sds': 'sds' }) }}
                            disabled={formik.isSubmitting}>
                            {formik.isSubmitting && <CircularProgress id='logoutProceed' size={20}
                                sx={{ mr: 2, color: '#08e8de' }} />}
                            Proceed
                        </Button>

                        {!formik.isSubmitting && <Button variant='text' onClick={handleCancel}
                            sx={{ fontSize: 18, fontWeight: 700, color: '#646464' }}>
                            Cancel
                        </Button>}
                    </form>



                </Box>
            </Box>
        </Modal>)
}

export default LogOut;