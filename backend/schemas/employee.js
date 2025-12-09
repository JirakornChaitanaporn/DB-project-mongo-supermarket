import mongoose from "mongoose";

const { Schema } = mongoose;

export const employeeSchema = new Schema({
    firstname: {
        type:String,
        required: [true, "please Enter your firstname"]
    },
    lastname: {
        type:String,
        required: [true, "please Enter your lastname"]
    },
    phone_number: {
        type: String,
        required: [true, 'Please send phone number'],
        maxlength: 10,
        minlength: 10
    },
    gender: {
        type: String,
        required:  [true, 'Please send gender'],
        enum: {
            values: ['Male', 'Female'],
            message: '{VALUE} is not supported only (Male, Female)'
        }

    },
    created_at: {
        type: Date,
        required: [true, 'Please send created_at']
    },
    role_id: {
        type:Schema.ObjectId,
         required: [true, 'Please send role_name']
    },
});