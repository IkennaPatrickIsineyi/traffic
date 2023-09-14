import { Snackbar, Typography } from "@mui/material";

import CloseCircle from '@mui/icons-material/CloseRounded';
import { useContext } from "react";
import AppContext from "./appContext";

export default function SnackbarComponent({ message, severity }) {

    const { sharedData, updateSharedData } = useContext(AppContext);

    const snackBarOpen = sharedData.showSnackbar;

    const handleClose = () => {
        updateSharedData({ showSnackbar: false })
        // dispatch(closeSnackbar());
    }


    //Services all the snackbar need of the application

    const colors = {
        error: 'red', info: 'grey', success: 'green'
    }

    return <Snackbar open={snackBarOpen}
        autoHideDuration={6000}
        message={message}
        severity={severity}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={handleClose}
        sx={{ display: 'flex', justifyContent: 'center' }}
    >
        <Typography sx={{
            borderRadius: '10px', display: 'flex', justifyContent: 'center',
            alignItems: 'center',
            py: .5, px: 1, color: 'white', bgcolor: colors[severity],
            fontSize: { xs: 14, sm: 14 }
        }}>
            {message}
            <CloseCircle sx={{
                display: 'flex', justifyContent: 'center',
                alignItems: 'center', fontSize: 14, color: 'black', cursor: 'pointer', ml: 2
            }}
                onClick={handleClose}
            />
        </Typography>

    </Snackbar>

}