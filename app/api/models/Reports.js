import mongoose, { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const reportSchema = new Schema({
    date: { type: Date, required: true },
    plateNumber: { type: String, required: true },
    location: { type: String, required: true },
    casualties: { type: Number, required: false },
    degree: { type: String, required: false },
    details: { type: String, required: false },
    category: { type: String, required: false },
    reportType: { type: String, required: true },
});

const Reports = mongoose.models?.Reports || model('Reports', reportSchema)


export default Reports