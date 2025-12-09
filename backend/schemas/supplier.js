import mongoose from 'mongoose';

const { Schema } = mongoose;

export const supplierSchema = new Schema({
    supplier_name: {
        type: String,
        required: [true, 'Please send supplier_name']
    },
    phone_number: {
        type: String
    },
    contact_person: {
        type: String
    },
    address: {
        type: String
    }
})
