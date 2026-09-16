const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/auth");
const upload = require("../Middleware/upload");

const {
    AddBook,
    GetBooks,
    GetBook,
    UpdateBook,
    DeleteBook
} = require("../controllers/bookcontroller");

router.post("/", authMiddleware, upload.single("image"), AddBook);

router.get("/", GetBooks);

router.get("/:id", GetBook);

router.put("/:id", authMiddleware, upload.single("image"), UpdateBook);

router.delete("/:id", authMiddleware, DeleteBook);

module.exports = router;