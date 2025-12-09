import mongoose from 'mongoose';

const { Schema } = mongoose;

export const customerSchema = new Schema({
    firstname: {
        type: String,
        required: [true, 'Please send firstname']
    },
    lastname: {
        type: String,
        required: [true, 'Please send lastname']
    },
    phone_number: {
        type: String,
        required: [true, 'Please send phone_number']
    },
    loyalty_points: {
        type: Number,
        min: [0, "points can't be negetive"],
        max: [1000, "points can't greater than 1000"],
        required: [true, 'Please send loyalty_points']
    },
    created_at: {
        type: Date,
        required: [true, 'Please send created_at']
    },
})