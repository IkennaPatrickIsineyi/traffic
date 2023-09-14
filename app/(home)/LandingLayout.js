'use client'

import { ThemeProvider, createTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import Landing from "./Landing";
import AppContext, { AppContextProvider } from "@/Components/appContext";

export default function LandingLayout({ children }) {
    const [state, setState] = useState({
        darkMode: false, cms: false, isMobile: false, menuOpen: false
    });

    useEffect(() => {
        updateState({ isMobile: window.innerWidth < 900, darkMode: localStorage.getItem('theme') === 'dark' ? true : false })
    }, [])

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }


    let theme = useMemo(() => {
        return createTheme({
            typography: {
                button: {
                    textTransform: 'none',
                },
                fontFamily: 'Open Sans'
            },
            palette: {
                mode: state.darkMode ? 'dark' : 'light',
                primary: { main: '#BF0606' }
            },
            components: {
                MuiButton: {
                    styleOverrides: {
                        contained: {
                            backgroundColor: '#BF0606',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#970000'
                            }
                        },
                        text: {
                            color: '#BF0606',
                            '&:hover': {
                                backgroundColor: '#FAF0F0'
                            }

                        }
                    }
                },
                MuiListItemButton: {
                    styleOverrides: {
                        root: {
                            color: 'black',
                            '&.Mui-selected': {
                                borderRight: '2px solid #BF0606',
                                color: '#BF0606'
                            }
                        }
                    }
                }
            }
        })
    }, [])

    return <ThemeProvider theme={theme}>
        <AppContextProvider>
            <Landing {...{ children: children }} />
        </AppContextProvider>

    </ThemeProvider>
}