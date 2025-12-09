import mongoose from 'mongoose';

const { Schema } = mongoose;

export const promotionSchema = new Schema({
    promo_name: {
        type: String,
        required: [true, 'Please send promo_name']
    },
    discount_percent: {
        type: Number,
        required: [true, 'Please send discount_percent'],
        min: [0, "discount can't be negative"],
        max: [100, "discount can't be greater than 100"]
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    product_id: {
        type: Schema.ObjectId,
        required: [true, 'Please send product_id']
    }
})
