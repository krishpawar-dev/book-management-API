import { Link } from "react-router-dom";
import API_URL from "../api/api";

function BookCard({ book, onDelete }) {
    const handleDelete = async () => {
        if (!window.confirm(`Delete "${book.title}" from the library?`)) {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${API_URL}/book/${book._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                onDelete(book._id);
            } else {
                alert(data.message || "Unable to delete the book");
            }
        } catch {
            alert("Unable to connect to the server");
        }
    };

    return (
        <article className="book-card">
            <div className="book-cover-wrap">
                {book.image ? (
                    <img
                        src={`${API_URL}/uploads/books/${book.image}`}
                        alt={book.title}
                        className="book-image"
                    />
                ) : (
                    <div className="book-placeholder">📚</div>
                )}

                <span className="category-pill">{book.category}</span>
            </div>

            <div className="book-info">
                <p className="book-author">by {book.author}</p>
                <h2 title={book.title}>{book.title}</h2>
                <p className="book-description">{book.description}</p>

                <div className="book-meta">
                    <strong>₹{Number(book.price).toLocaleString("en-IN")}</strong>
                    <span>Added by {book.createdBy?.username || "User"}</span>
                </div>

                <div className="book-actions">
                    <Link to={`/edit-book/${book._id}`} className="edit-btn">
                        Edit details
                    </Link>
                    <button className="delete-btn" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
}

export default BookCard;
