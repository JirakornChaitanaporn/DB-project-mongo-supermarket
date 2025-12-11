const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
    supplier_name: {
        type: String,
        required: true,
    },
    contacts: {
        person: { 
            type: String,
            required: true,
        },
        email: { 
            type: String,
        },
        phone: { 
            type: String,
            required: true,
        },
    },
    address: {
        street: { 
            type: String,
            required: true,
        },
        city: { 
            type: String,
            required: true,
        },
        postal_code: { 
            type: String,
            required: true,
        },
        country: { 
            type: String,
            required: true,
        },
    },
}, { collection: "suppliers" });

module.exports = mongoose.model("Supplier", SupplierSchema);
