import mongoose from 'mongoose';

const { Schema } = mongoose;

export const productSchema = new Schema({
    product_name: {
        type: String,
        required: [true, 'Please send product_name']
    },
    price: {
        type: Number,
        required: [true, 'Please send price'],
        min: [0, "price can't be negative"]
    },
    created_at: {
        type: Date,
        required: [true, 'Please send created_at']
    },
    supplier_id: {
        type: Schema.ObjectId,
        required: [true, 'Please send supplier_id']
    },
    category_id: {
        type: Schema.ObjectId,
        required: [true, 'Please send category_id']
    },
    quantity: {
        type: Number,
        min: [0, "quantity can't be negative"]
    }
})
