import mongoose from 'mongoose';

const { Schema } = mongoose;

export const customerSchema = new Schema({
    firstname: String,
    lastname: String,
    phone_number: String,
    loyalty_points: Number,
    created_at: Date
})