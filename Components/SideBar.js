'use client'

import { useContext, useMemo, useState } from 'react'

import TeamIcon from '@mui/icons-material/GroupOutlined'
import CloseIcon from '@mui/icons-material/Close'
import CaretDownIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import CaretUpIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import AccidentIcon from "@mui/icons-material/CarCrashOutlined";
import TheftIcon from "@mui/icons-material/DirectionsRunOutlined";
import TrafficIcon from "@mui/icons-material/TrafficOutlined";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Backdrop, Box, Divider, Typography } from '@mui/material';
import IconElement from './IconElement';
import SnackbarComponent from './Snackbar';
import LogOut from './LogOut';
import { useEffect } from 'react';
import { CalendarSvg, DashboardSvg, LogOutSvg, OnePersonSvg, Privilege, ProjectGroupSvg, SettingSvg, ThreePersonSvg } from '@/public/icons/icons';
import AppContext from './appContext';

const sitelogo = '/images/sitelogo.jpg'

const toolsSubMenuIds = ['crm', 'forms', 'documents']

export default function SideBar({ isMenuOpen, closeMenu }) {
    const router = useRouter();
    const params = useSearchParams();

    const { sharedData, updateSharedData } = useContext(AppContext);

    const message = sharedData.snackbarMessage;
    const severity = sharedData.snackbarSeverity;
    const snackBarOpen = sharedData.showSnackbar;

    const pathname = usePathname();



    const [state, setState] = useState({
        selectedToolSubMenu: '', openTools: false, openMenu: false, selectedMenu: ''
    });

    const updateState = (newValue) => {
        setState((previousValue) => {
            return { ...previousValue, ...newValue };
        });
    };

    const getSelectedTab = () => {
        const pathname1 = pathname.split('/')[2] ?? ''

        console.log('pathname', pathname, pathname1);

        const setSubMenu = (id) => {
            updateState({ selectedToolSubMenu: id })
        }

        switch (pathname1) {
            case '':
            case 'accidents':
                return 'accidents';
            case 'thefts':
                return 'thefts';
            case 'traffic-offence':
                return 'traffic-offence';
            case 'reports':
                return 'reports';
            case 'incidence':
                return params.get('type');
        }
    }

    useEffect(() => {
        updateState({ selectedMenu: getSelectedTab() })
    }, [pathname])

    const handleDrawerClose = () => {
        closeMenu()
    };

    const userType = pathname.split('/')[1];

    const handleSideNav = (event) => {
        const id = event.currentTarget.id;

        router.push(`/${userType}/${id}`,);

        toolsSubMenuIds.includes(id) ?
            updateState({ selectedToolSubMenu: id, selectedMenu: 'tools', })
            : updateState({ selectedToolSubMenu: '', selectedMenu: id, })

        handleDrawerClose();
    }

    const handleViewProfile = () => {
        updateState({ selectedToolSubMenu: '', selectedMenu: 'my-profile', })
        router.push(`/${userType}/my-profile`, { state: { email: null, self: true } });
    }


    const openLogOut = (event) => {
        //dispatch(openLogoutPrompt());
        updateSharedData({ logOut: true })
        handleDrawerClose();
    }

    const iconStyle = { height: '20px', width: '20px', marginRight: '24px' }

    const sideBarData = useMemo(() => {
        return [
            { label: 'Accidents', route: 'accidents', icon: <AccidentIcon style={{ ...iconStyle }} />, processor: handleSideNav },
            { label: 'Thefts', route: 'thefts', icon: <TheftIcon style={{ ...iconStyle }} />, processor: handleSideNav },
            { label: 'Traffic Offence', route: 'traffic-offence', icon: <TrafficIcon style={{ ...iconStyle }} />, processor: handleSideNav },
            userType === 'admin' && { label: 'Reports', route: 'reports', icon: <DashboardSvg style={{ ...iconStyle }} />, processor: handleSideNav },
            // userType === 'admin' && { label: 'Users', route: 'users', icon: <ProjectGroupSvg style={{ ...iconStyle }} />, processor: handleSideNav },
        ];
    }, [state.openTools, state.selectedToolSubMenu])


    const sideBarButton = ({ label, onclick, iconSrc, id, index, justifySelf }) => {
        const selected = state.selectedMenu === id;

        return <Typography key={index} id={id} onClick={onclick}
            sx={{
                display: 'flex', alignItems: 'center', px: 2, py: 1, mb: 1, minWidth: { xs: '60vw', sm: '30vw', md: 0 },
                bgcolor: selected ? '#BF06061A' : 'white', color: id === 'logout' ? '#BF0606' : selected ? '#BF0606' : '#5D5D5D',
                justifySelf: justifySelf, cursor: 'pointer', ":hover": { background: '#BF06061A' },
                borderRight: selected ? '2px solid #BF0606' : 'none'
            }}>
            {iconSrc}

            {label}

            {Boolean(id === 'tools') ?
                state.openTools ? <CaretUpIcon /> : <CaretDownIcon /> : null}
        </Typography>
    }

    return <Box sx={{
        minWidth: { md: '200px' }, position: { xs: 'absolute', md: 'relative', }, maxWidth: 'max-content', zIndex: 1111,
        top: 0, left: 0, right: 0, bottom: 0, height: { xs: 'calc(100vh - vh)', md: '100vh' }, background: 'white', borderRight: '1px solid #C5C5C5',
        display: { xs: isMenuOpen ? 'block' : 'none', md: 'block' }, overflowY: { xs: 'hidden', md: 'auto' }

    }}>
        <Box sx={{ zIndex: 1111, bgcolor: 'white', height: '100%' }}>

            <Box sx={{ display: { md: 'none' } }}>
                {/* Lamid logo */}
                <IconElement {...{
                    src: sitelogo, style: {
                        margin: '12px 8px', borderRight: '2px solid black',
                        height: '40px', width: '40px'
                    }
                }} />

                {/* Menu label */}
                <Typography sx={{
                    display: 'flex', bgcolor: '#EFEFEF', px: 2, py: 1.5, fontSize: 14, fontWeight: 600,
                    alignItems: 'center', justifyContent: 'space-between'
                }}>
                    MENU
                    <CloseIcon onClick={handleDrawerClose} />
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Section 1 */}
                <Box sx={{ mt: 2, mb: 8 }}>
                    {sideBarData.map((data, index) => {
                        const id = data?.route;
                        return <Box key={index}>
                            {sideBarButton({
                                label: data.label, onclick: data.processor, id: id,
                                iconSrc: data.icon, index: index
                            })}
                        </Box>
                    })}

                </Box>

                <Divider />

                {/* Log out button */}
                {sideBarButton({
                    label: 'Log Out', onclick: openLogOut, id: 'logout', justifySelf: 'flex-end',
                    iconSrc: <LogOutSvg style={{ ...iconStyle }} />,
                })}

            </Box>
        </Box>

        <Backdrop onClick={closeMenu} open={true} sx={{ display: { md: 'none' }, zIndex: -2 }} >

        </Backdrop>

        {/* Snackbar that services the whole application */}
        {snackBarOpen && <SnackbarComponent {...{ message: message, severity: severity }} />}

        {/* Logout prompt for all the children */}
        <LogOut />
    </Box>
}