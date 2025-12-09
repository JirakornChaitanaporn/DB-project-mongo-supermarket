import mongoose from 'mongoose';

const { Schema } = mongoose;

export const billSchema = new Schema({
    customer_id: {
        type: Schema.ObjectId,
        required: [true, 'Please send customer_id']
    },
    employee_id: {
        type: Schema.ObjectId,
        required: [true, 'Please send employee_id']
    },
    total_amount: {
        type: Number,
        required: [true, 'Please send total_amount'],
        min: [0, "total_amount can't be negative"]
    },
    transaction_time: {
        type: Date
    }
})
