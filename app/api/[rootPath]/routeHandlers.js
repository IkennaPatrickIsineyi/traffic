import { deleteSession, getSession, isLoggedIn, logOut, setSession } from "@/Components/session";
import User from "../models/User";
import sendEmail from "./sendEmail";
import moment from "moment";
import bcrypt from 'bcrypt'
import { generate as genOtp } from 'otp-generator'


import fs from 'node:fs/promises'

import { writeFileSync } from 'node:fs'
import path from "node:path";
import Accidents from "../models/Accidents";
import Thefts from "../models/Theft";
import TrafficOffence from "../models/TrafficOffence";
import Reports from "../models/Reports";

const initialPath = process.env.NODE_ENV === 'production' ? '/tmp' : process.cwd();

const hashPassword = (password, callback) => {
    bcrypt.hash(password, 10, callback);
}

const generateOtp = () => {
    return genOtp(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false, specialChars: false
    });
}

const saveFile = async ({ folder, fileArray }) => {
    //Array of object: {filename:name, filedata:data}

    return mkdirp(path.join(initialPath, 'files', folder,)).then((made) => {
        return fileArray.map(async (fileObj) => {
            const filename = fileObj.filename;
            const filedata = fileObj.filedata;

            const data = await filedata.arrayBuffer();
            const buffer = Buffer.from(data);

            const saveFileIn = path.join(initialPath, 'files', folder, filename);


            writeFileSync(saveFileIn, buffer)
        })
    })
}

const fetchFile = async ({ filePath }) => {
    const buffer = await fs.readFile(filePath);

    if (buffer)
        return buffer
}

const deleteFile = async ({ filePath }) => {
    return await fs.unlink(filePath);
}

export async function handleCheckLoginStatus(searchParams) {
    const loggedIn = await isLoggedIn()
    console.log('logged in', loggedIn)
    return { result: loggedIn };
}

export async function handleLogOut(searchParams) {
    const loggedOut = await logOut()
    console.log('logged out', loggedOut)
    return { result: loggedOut };
}

export async function handleLogin(searchParams) {
    console.log('handle login called')
    const designation = await isLoggedIn()

    if (designation) {
        //user is already logged in. Just return true to say that login succeeded. 
        //No need telling the user that they are already logged in
        console.log('designation failed', designation)
        return { result: designation }
    }
    else {
        const email = searchParams.get('email')
        const password = searchParams.get('password')

        //Get the password hash for this email the password
        const userData = await User.findOne({ email: email });

        console.log('user data', userData);

        const match = await bcrypt.compare(password, userData?.password);
        console.log('data', match)


        if (match) {
            //The password matches what the user has. Go ahead and load the user in
            const done = await setSession({
                email: email, fullName: userData?.fullName,
                profilePicture: userData?.profilePicture, designation: userData?.designation
            });

            console.log('done', done);
            return { result: done }
        }
        else {
            //The password does not match
            console.log('password missmatch')
            return { result: false }
        }
    }

}

export async function handleRegister(searchParams) {
    console.log('handle register called')
    const designation = await isLoggedIn()

    if (designation) {
        //user is already logged in. Just return true to say that login succeeded. 
        //No need telling the user that they are already logged in
        console.log('designation failed', designation)
        return { result: designation }
    }
    else {
        const email = searchParams.get('email')
        const password = searchParams.get('password')
        const fullName = searchParams.get('fullName')
        const phone = searchParams.get('phone')

        //Get the password hash for this email the password
        const userData = await User.findOne({ email: email });

        console.log('user data', userData);

        if (userData) {
            return { error: 'Email already exists' }
        }
        else {
            const hash = await bcrypt.hash(password, Number(process.env.SALT));

            const user = User({ email: email, password: hash, phone: phone, fullName: fullName, designation: 'user' })

            const done = await user.save()

            if (done) {
                console.log('done', done);

                const logged = await setSession({
                    email: email, fullName: fullName,
                    profilePicture: '', designation: 'user'
                });

                return { result: 'logged in' };
            }
            else {
                return { error: 'Something went wrong' };
            }
        }

    }

}


export async function handleOtpRequest(searchParams, email) {
    const otp = generateOtp()
    email = email ?? searchParams.get('email')

    const emailPayload = {
        from: `Password Reset <${process.env.EMAIL}>`,
        to: email,
        subject: 'Reset password',
        text: `The OTP for resetting your password is ${otp}`,
        html: `<p>Hi</p><p>The OTP for resetting your password is ${otp}</p>`
    };

    const emailSent = await sendEmail({
        toEmail: emailPayload.to, fromHeading: emailPayload.from,
        subject: emailPayload.subject, text: emailPayload.text, html: emailPayload.html,
    })

    if (emailSent !== null) {
        //save the otp in session
        console.log('returned', emailSent)
        const done = await setSession({ otp: otp, email: email }, 'otp')
        return { result: done }
    }
}

export async function handleVerifyOtp(searchParams) {
    const otp = searchParams.get('otp');
    const realOtp = await getSession('otp');

    console.log(otp, realOtp);

    if (realOtp?.otp?.toString() === otp) {
        console.log('matched')
        const reset = await deleteSession(['otp']);

        //Set a flag that shows a user is ready for password change
        const markerSet = await setSession({ email: realOtp?.email }, 'passwordChangeMarker')

        return { result: markerSet };
    }
    else {
        console.log('mismatch')
        return { result: false };
    }
}

export async function resendOtp(searchParams) {
    const otpObject = await getSession('otp');

    console.log(otpObject);

    const sent = await handleOtpRequest(null, otpObject.email);

    return sent
}

export async function changePassword(searchParams) {
    const marker = await getSession('passwordChangeMarker');

    if (!marker?.email) {
        //User has not been auhenticated for password change
        return { result: false }
    }
    else {
        //User has been authenticated for password change. Go ahead with the change
        const password = searchParams.get('password');
        const salt = Number(process.env.SALT)

        console.log('salt', salt, marker.email)

        const passwordHash = await bcrypt.hash(password, salt);

        const modified = await User.updateOne({ email: marker.email }, { $set: { password: passwordHash } })

        console.log('done updating', modified);

        //Clean up:
        //delete the passwordChangeMarker cookie
        if (modified) {
            console.log('password changed');
            const done = await deleteSession(['passwordChangeMarker']);

            return { result: done || true }
        }
        else {
            console.log('password not changed');

            return { result: false }
        }
    }


}

export async function checkEmail(searchParams) {
    const email = searchParams.get('email');

    const existingUsers = await User.findOne({ email: email }).select({ _id: 1 })

    console.log('existing staff', existingUsers);

    return { result: Boolean(existingUsers) }
}

export async function getIncidenceList(searchParams) {
    const type = searchParams.get('type');
    const page = searchParams.get('page');
    const perPage = 10;

    const result = []

    switch (type) {
        case 'accidents':
            result.push(...(await Accidents.find({}).sort({ _id: 'desc' })))
            break
        case 'thefts':
            result.push(...(await Thefts.find({}).sort({ _id: 'desc' })))
            break
        case 'traffic-offence':
            result.push(...(await TrafficOffence.find({}).sort({ _id: 'desc' })))
            break
        case 'reports':
            result.push(...(await Reports.find({}).sort({ _id: 'desc' })))
            break
        default:
            console.log('404 in list of incidence')
            result.push(...[])
    }

    console.log('list of incidence', result);

    return { result: result }
}

export async function getIncidenceById(searchParams) {
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    let result = null

    switch (type) {
        case 'accidents':
            result = await Accidents.findOne({ _id: id })
            break
        case 'thefts':
            result = await Thefts.findOne({ _id: id })
            break
        case 'traffic-offence':
            result = await TrafficOffence.findOne({ _id: id })
            break
        case 'reports':
            result = await Reports.findOne({ _id: id })
            break
        default:
            console.log('404 in find incidence by id')
            result = {}
    }

    console.log('list of incidence by id', result);

    return { result: result }
}

export async function getIncidenceByPlateNumber(searchParams) {
    const type = searchParams.get('type');
    const plateNumber = searchParams.get('plateNumber');

    let result = null

    switch (type) {
        case 'accidents':
            result = await Accidents.findOne({ plateNumber: plateNumber })
            break
        case 'thefts':
            result = await Thefts.findOne({ plateNumber: plateNumber })
            break
        case 'traffic-offence':
            result = await TrafficOffence.findOne({ plateNumber: plateNumber })
            break
        case 'reports':
            result = await Reports.findOne({ plateNumber: plateNumber })
            break
        default:
            console.log('404 in find incidence by id')
            result = {}
    }

    console.log('incidence by plate number', result);

    return { result: result?._id }
}

export async function deleteIncidenceById(searchParams) {
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    switch (type) {
        case 'accidents':
            await Accidents.deleteOne({ _id: id })
            break
        case 'thefts':
            await Thefts.deleteOne({ _id: id })
            break
        case 'traffic-offence':
            await TrafficOffence.deleteOne({ _id: id })
            break
        case 'reports':
            await Reports.deleteOne({ _id: id })
            break
        default:
            console.log('404 in find incidence by id')
    }


    return { result: 'deleted' }
}

export async function updateIncidenceById(searchParams) {
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const plateNumber = searchParams.get('plateNumber');
    const date = searchParams.get('date');
    const casualties = searchParams.get('casualties');
    const degree = searchParams.get('degree');
    const details = searchParams.get('details');
    const location = searchParams.get('location');
    const category = searchParams.get('category');
    const reportType = searchParams.get('reportType');


    switch (type) {
        case 'accidents':
            await Accidents.updateOne({ _id: id }, {
                $set: {
                    plateNumber: plateNumber, date: date,
                    casualties: casualties, degree: degree, details: details, location: location
                }
            });
            break
        case 'thefts':
            await Thefts.updateOne({ _id: id }, {
                $set: {
                    plateNumber: plateNumber, date: date, details: details, location: location
                }
            });
            break
        case 'traffic-offence':
            await TrafficOffence.updateOne({ _id: id }, {
                $set: {
                    plateNumber: plateNumber, date: date, details: details, location: location, category: category
                }
            });
            break
        case 'reports':
            await Reports.updateOne({ _id: id }, {
                $set: {
                    plateNumber: plateNumber, date: date, reportType: reportType,
                    casualties: casualties, degree: degree, details: details, location: location, category: category
                }
            });
            break
        default:
            console.log('404 in update incidence by id')
    }


    return { result: 'updated' }
}

export async function createIncidence(searchParams) {
    const type = searchParams.get('type');
    const plateNumber = searchParams.get('plateNumber');
    const date = searchParams.get('date');
    const casualties = searchParams.get('casualties');
    const degree = searchParams.get('degree');
    const details = searchParams.get('details');
    const location = searchParams.get('location');
    const category = searchParams.get('category');
    const reportType = searchParams.get('reportType');

    let incidence = null;

    switch (type) {
        case 'accidents':
            incidence = Accidents({
                plateNumber: plateNumber, date: date,
                casualties: casualties, degree: degree, details: details, location: location
            });
            await incidence.save();
            break
        case 'thefts':
            incidence = Thefts({
                plateNumber: plateNumber, date: date, details: details, location: location
            });
            await incidence.save();
            break
        case 'traffic-offence':
            incidence = TrafficOffence({
                plateNumber: plateNumber, date: date, details: details, location: location, category: category
            });
            await incidence.save();
            break
        case 'reports':
            incidence = Reports({
                plateNumber: plateNumber, date: date, reportType: reportType,
                casualties: casualties, degree: degree, details: details, location: location, category: category
            });
            await incidence.save();
            break
        default:
            console.log('404 in create incidence')
    }

    return { result: 'deleted' }
}