import mongoose, { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const accidentSchema = new Schema({
    date: { type: Date, required: true },
    plateNumber: { type: String, required: true },
    location: { type: String, required: true },
    casualties: { type: Number, required: true },
    degree: { type: String, required: true },
    details: { type: String, required: true },
});

const Accidents = mongoose.models?.Accidents || model('Accidents', accidentSchema)


export default Accidents