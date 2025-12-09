import mongoose from 'mongoose';

const { Schema } = mongoose;

export const productCategorySchema = new Schema({
    category_name: {
        type: String,
        required: [true, 'Please send category_name']
    },
    category_description: {
        type: String
    }
})
