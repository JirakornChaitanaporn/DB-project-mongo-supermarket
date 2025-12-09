import mongoose from 'mongoose';

const { Schema } = mongoose;

export const billItemSchema = new Schema({
    bill_id: {
        type: Schema.ObjectId,
        required: [true, 'Please send bill_id']
    },
    product_id: {
        type: Schema.ObjectId,
        required: [true, 'Please send product_id']
    },
    quantity: {
        type: Number,
        required: [true, 'Please send quantity'],
        min: [1, "quantity must be at least 1"]
    },
    price_at_time_of_sale: {
        type: Number,
        required: [true, 'Please send price_at_time_of_sale'],
        min: [0, "price can't be negative"]
    }
})
