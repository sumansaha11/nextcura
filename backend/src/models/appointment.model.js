import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        docId: {
            type: String,
            required: true,
            index: true
        },
        slotDate: {
            type: String,
            required: true
        },
        slotTime: {
            type: String,
            required: true
        },
        userData: {
            type: Object,
            required: true
        },
        docData: {
            type: Object,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        cancelled: {
            type: Boolean,
            default: false
        },
        payment: {
            type: Boolean,
            default: false
        },
        isCompleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

export const appointmentModel = mongoose.model("Appointment", appointmentSchema);