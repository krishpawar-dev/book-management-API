const Book = require("../models/BookUser");

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

        const book = await Book.create({
            title,
            author,
            category,
            price,
            description,
            image: req.file.filename,
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
            book.image = req.file.filename;
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