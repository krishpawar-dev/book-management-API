const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: true,
        },
    },
);

module.exports = mongoose.model("User", UserSchema);