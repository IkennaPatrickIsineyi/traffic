import mongoose, { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const trafficOffenceSchema = new Schema({
    date: { type: Date, required: true },
    plateNumber: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    details: { type: String, required: true },
});

const TrafficOffence = mongoose.models?.TrafficOffence || model('TrafficOffence', trafficOffenceSchema)


export default TrafficOffence