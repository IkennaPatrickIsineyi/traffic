'use client'

import AppContext from "@/Components/appContext";
import {
    Box, IconButton, OutlinedInput, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'


import { useContext, useEffect, useState, } from "react";
import Accidents from "../accidents/Component";

export default function TrafficOffences() {


    return <Accidents pageName={'Traffic Offence'} headings={['S/N', 'Date', 'Plate Number', 'Location', 'Category', 'Details', 'Delete', 'Edit']} />
} 