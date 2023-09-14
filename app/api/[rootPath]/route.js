
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import {
    addAccident,
    createIncidence,
    deleteIncidenceById,
    getIncidenceById,
    getIncidenceByPlateNumber,
    getIncidenceList,
    handleCheckLoginStatus, handleLogOut, handleLogin, handleOtpRequest, handleRegister, handleVerifyOtp, resendOtp, updateIncidenceById,
} from "./routeHandlers";

export const dynamic = "force-dynamic"

export async function isLoggedIn() {
    const loggedIn = await handleCheckLoginStatus();
    return loggedIn?.result
}

const loginAuth = { authErr: 'login', authUrl: '/login', type: 'login' }

export async function GET(req, { params }) {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('connected')
        }
        else {
            console.log('connecting to db')
            const dbName = (process.env.NODE_ENV === 'production') ? 'traffic' : 'trafficTest';

            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI

            await mongoose.connect(URI, { dbName: dbName })
        }

        const route = params.rootPath;

        console.log('route', route)
        const { searchParams } = new URL(req.url);

        console.log('generic request handler', searchParams,);

        let response;

        switch (route) {
            case 'check-status':
                response = await handleCheckLoginStatus(searchParams);
                return NextResponse.json(response)
            case 'log-out':
                response = await handleLogOut(searchParams);
                return NextResponse.json(response)
            case 'otp-request':
                response = await handleOtpRequest(searchParams);
                return NextResponse.json(response)
            case 'resend-otp':
                response = await resendOtp(searchParams);
                return NextResponse.json(response)
            case 'get-incidence-list':
                response = await getIncidenceList(searchParams);
                return NextResponse.json(response)
            case 'get-incidence':
                response = await getIncidenceById(searchParams);
                return NextResponse.json(response)
            case 'get-incidence-by-licence':
                response = await getIncidenceByPlateNumber(searchParams);
                return NextResponse.json(response)
            case 'delete-incidence':
                response = await deleteIncidenceById(searchParams);
                return NextResponse.json(response);
            default:
                return NextResponse.json({ error: 'not found' })
        }

    } catch (error) {
        console.log('something went wrong', error)
        return NextResponse.json({ errMsg: 'Something went wrong' })
    }

}

export async function POST(req, { params }) {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('connected')
        }
        else {
            console.log('connecting to db')
            const dbName = (process.env.NODE_ENV === 'production') ? 'traffic' : 'trafficTest';

            const URI = (process.env.NODE_ENV === 'production') ? process.env.MONGO_URI : process.env.MONGO_LOCAL_URI

            await mongoose.connect(URI, { dbName: dbName })
        }

        const route = params.rootPath;

        console.log('route', route);

        const payload = await req.formData();


        console.log('generic request handler', payload,);

        let response;

        switch (route) {
            case 'login':
                response = await handleLogin(payload);
                return NextResponse.json(response);
            case 'register':
                response = await handleRegister(payload);
                return NextResponse.json(response);
            case 'verify-otp':
                response = await handleVerifyOtp(payload);
                return NextResponse.json(response);
            case 'change-password':
                response = await changePassword(payload);
                return NextResponse.json(response);
            case 'add-incidence':
                response = await createIncidence(payload);
                return NextResponse.json(response);
            case 'update-incidence':
                response = await updateIncidenceById(payload);
                return NextResponse.json(response);
            default:
                return NextResponse.json({ error: 'not found' })
        }
    } catch (error) {
        console.log('something went wrong', error)
        return NextResponse.json({ errMsg: 'Something went wrong' })
    }
}
