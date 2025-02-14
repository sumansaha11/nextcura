import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const doctorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        image: {
            type: {
                public_id: String,
                url: String,
            },
            required: true
        },
        speciality: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        degree: {
            type: String,
            required: true
        },
        experience: {
            type: String,
            required: true
        },
        about: {
            type: String,
            required: true,
            trim: true
        },
        available: {
            type: Boolean,
            default: true
        },
        fees: {
            type: Number,
            required: true
        },
        address: {
            type: Object,
            required: true,
        },
        slots_booked: {
            type: Object,
            default: {}
        },
        refreshToken: {
            type: String
        }
    },
    {
        minimize: false,
        timestamps: true
    }
)

doctorSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
        next()

    } else {
        return next()
    }
});

doctorSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
};

doctorSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
};

doctorSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
};

export const doctorModel = mongoose.model("Doctor", doctorSchema);