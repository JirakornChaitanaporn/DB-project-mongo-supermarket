import mongoose from "mongoose";

const { Schema } = mongoose;

export const roleSchema = new Schema(
    {
        role_name: {
            type: String,
            required:[true, 'The role name is required']
        },
        role_description: {
            type: String,
            required: [true, 'The role description is required']
        },
        role_salary: {
            type: Number,
            min: [10000, "min salary can be 10000 only"],
            required: [true, 'The role salary is required']

        }
    }
)