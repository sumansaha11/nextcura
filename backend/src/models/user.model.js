import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
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
            default: { public_id: "nextcura/user/inykyhi7yhs7ucxosgor", url: "https://res.cloudinary.com/sumansaha/image/upload/v1738262729/nextcura/user/inykyhi7yhs7ucxosgor.png" }
        },
        address: {
            type: Object,
            default: {
                line1: '',
                line2: ''
            }
        },
        gender: {
            type: String,
            default: 'Not Selected'
        },
        dob: {
            type: String,
            default: 'Not Selected'
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
        next()

    } else {
        return next()
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
};

userSchema.methods.generateAccessToken = function () {
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

userSchema.methods.generateRefreshToken = function () {
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

export const userModel = mongoose.model("User", userSchema);