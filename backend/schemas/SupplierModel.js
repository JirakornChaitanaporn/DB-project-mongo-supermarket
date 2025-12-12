import mongoose from "mongoose";

export const SupplierSchema = new mongoose.Schema({
    supplier_name: {
        type: String,
        required: [true, "supplier name is needed"],
    },
    contacts: {
        person: {
            type: String,
            required: [true, "contact person is needed"],
        },
        email: {
            type: String,
            unique: [true, "This email already existed"],
            required: [true, "Email is needed"]
        },
        phone: {
            type: String,
            unique:[true, "This phone number existed already"],
            required: [true, "phone is needed"],
        },
    },
    address: {
        street: {
            type: String,
            required: [true, "street name is needed"],
        },
        city: {
            type: String,
            required: [true, "city is needed"],
        },
        postal_code: {
            type: String,
            required: [true, "postal code is needed"],
        },
        country: {
            type: String,
            required: [true, "country is needed"],
        },
    },
}, { collection: "suppliers" });
