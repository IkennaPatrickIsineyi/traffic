import mongoose, { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const theftSchema = new Schema({
    date: { type: Date, required: true },
    plateNumber: { type: String, required: true },
    location: { type: String, required: true },
    details: { type: String, required: true },
});

const Thefts = mongoose.models?.Thefts || model('Thefts', theftSchema)


export default Thefts