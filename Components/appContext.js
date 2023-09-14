'use client'

import { createContext, useContext, useState } from 'react'

const AppContext = createContext();

const contextObject = {
    disabledButtons: false,
    logOut: false,
    showSnackbar: false,
    snackbarMessage: '',
    snackbarSeverity: '',
    blockView: false,
    pageTitle: '',
}

export const AppContextProvider = ({ children }) => {
    const [sharedData, setSharedData] = useState({ ...contextObject });

    const updateSharedData = (newDataObject) => {
        setSharedData((prevData) => {
            return { ...prevData, ...newDataObject }
        })
    };

    return (
        <AppContext.Provider value={{ sharedData, updateSharedData }}>
            {children}
        </AppContext.Provider>
    )
}


export default AppContext;