'use client'

import { Badge, Box, IconButton, Typography } from "@mui/material"
import IconElement from "./IconElement"

import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import Notifications from '@mui/icons-material/NotificationsOutlined';
import { ProfileAvatar } from "./ProfileAvatar";

import { useContext, useEffect } from "react";
import { useState } from "react";
import { getRequestHandler } from "./requestHandler";
import { useRef } from "react";
import { usePathname, useRouter } from "next/navigation"
import AppContext from "./appContext"

const lamidSmallLogo = '/images/lamidLogo.png'

const sitelogo = '/images/sitelogo.jpeg'

const getNotifications = ({ dataProcessor }) => {
    getRequestHandler({
        route: '/api/notifications-list',
        successCallback: body => {
            const result = body?.result;
            dataProcessor(result)
        },
        errorCallback: err => {
            console.log('Something went wrong', err)
        }
    })
}

export default function Header({ openMenu }) {
    const { sharedData, updateSharedData } = useContext(AppContext);
    const path = usePathname()

    const pageTitle = sharedData.pageTitle//useSelector(state => state.route.pageTitle); 
    const router = useRouter();

    const [state, setState] = useState({
        darkMode: false, cms: false, isMobile: false,
        menuOpen: false,
    });

    const updateState = (newValue) => {
        setState((previousValue) => { return { ...previousValue, ...newValue } });
    }


    const logo = ({ isSmall, style }) => {
        return <IconElement {...{ src: sitelogo, style: style }} />
    }

    const iconButton = ({ icon, onclick, style }) => {
        return <IconButton onClick={onclick} sx={{
            color: 'black'
        }}>
            {icon}
        </IconButton>
    }

    const gotoMyProfile = () => {
        router.push(`/${path.split('/')[1]}/my-profile`)
    }

    return <Box>
        {/* Row 1: Section is for only xs and sm breakpoints*/}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', borderBottom: '1px solid black' }}>
            {/* Logo */}
            {logo({ isSmall: true, style: { height: '50px', width: '50px', borderRight: '1px solid black' } })}
        </Box>

        {/* Row 2: Main toolbar for all devices */}
        <Box ref={state.notificationAnchor} sx={{
            display: 'flex', alignItems: 'center', py: { xs: 1, md: 0 },
            flexDirection: 'row', borderBottom: '1px solid black',
        }}>
            {/* Menu icon button: For xs and sm breakpoints only */}
            <Box sx={{ display: { md: 'none' }, mx: 1 }}>
                {iconButton({ icon: <MenuIcon sx={{ fontSize: 24 }} />, onclick: openMenu })}
            </Box>

            {/* Logo: For md and above breakpoints only */}
            <Box sx={{ display: { xs: 'none', md: 'inherit', }, maxWidth: 'max-content' }}>
                {logo({ isSmall: false, style: { height: '65px', width: '200px' } })}
            </Box>


            {/* Page title */}
            <Typography sx={{
                fontSize: { xs: 16, md: 20 }, textTransform: 'capitalize',
                fontWeight: 700, px: { xs: 0, md: 2 }
            }}>
                {pageTitle}
            </Typography>

            {/* Flex grow */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Avatar of staff */}
            <ProfileAvatar {...{
                fullName: 'John Martin',
                diameter: 30,
                styleProp: { letterSpacing: 0, mx: { xs: 1, md: 3 }, cursor: 'pointer' },
                onclick: gotoMyProfile
            }} />
        </Box>
    </Box>
}