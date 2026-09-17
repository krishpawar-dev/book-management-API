const Book = require("../models/BookUser");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "book-management/books",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

const AddBook = async (req, res) => {
    try {
        const {
            title,
            author,
            category,
            price,
            description
        } = req.body;

        if (!title || !author || !category || !price || !description || !req.file) {
            return res.status(400).json({
                success: false,
                message: "All fields including image are required",
            });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        const book = await Book.create({
            title,
            author,
            category,
            price,
            description,
            image: result.secure_url,
            createdBy: req.user.userId,
        });

        return res.status(201).json({
            success: true,
            message: "Book added successfully",
            data: book,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

const GetBooks = async (req, res) => {
    try {
        const books = await Book.find()
            .populate("createdBy", "username email");

        return res.status(200).json({
            success: true,
            message: "Books fetched successfully",
            count: books.length,
            data: books,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

const GetBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id)
            .populate("createdBy", "username email");

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Book fetched successfully",
            data: book,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

const UpdateBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        if (book.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this book",
            });
        }

        const {
            title,
            author,
            category,
            price,
            description
        } = req.body;

        book.title = title || book.title;
        book.author = author || book.author;
        book.category = category || book.category;
        book.price = price || book.price;
        book.description = description || book.description;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            book.image = result.secure_url;
        }

        await book.save();

        return res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


const DeleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found",
            });
        }

        if (book.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this book",
            });
        }

        await Book.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Book deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


module.exports = {
    AddBook,
    GetBooks,
    GetBook,
    UpdateBook,
    DeleteBook,
};