'use client'

import AppContext from "@/Components/appContext";
import {
    Box,
} from "@mui/material";


import { useContext, useEffect, useState, } from "react";
import IncidenceFinder from "../accidents/Component";

export default function TrafficOffences() {
    const [state, setState] = useState({
        selected: [], orderBy: '', order: '', tableContent: [], dataAdded: 0, dashboardData: {}, goalStatusData: {},
        staffArray: [], schedule: [], currentTool: 'crm'
    });

    const { sharedData, updateSharedData } = useContext(AppContext);

    return <IncidenceFinder pageName={'Traffic Offences'} />
} 