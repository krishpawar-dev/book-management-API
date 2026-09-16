const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },

    author: {
        type: String,
        required: true,
        trim: true,
    },

    category: {
        type: String,
        required: true,
        trim: true,
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    image: {
        type: String,
        required: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Book", BookSchema);