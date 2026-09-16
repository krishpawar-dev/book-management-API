import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api/api";
import BookCard from "../components/Bookcard";
import Navbar from "../components/Navbar";

function Dashboard() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchBooks = async () => {
        try {
            const response = await fetch(`${API_URL}/book`);
            const data = await response.json();

            if (data.success) {
                setBooks(data.data);
            } else {
                setMessage(data.message || "Unable to fetch books");
            }
        } catch {
            setMessage("Unable to connect to the server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const categories = useMemo(() => {
        return [
            "All",
            ...new Set(books.map((book) => book.category).filter(Boolean)),
        ];
    }, [books]);

    const filteredBooks = useMemo(() => {
        return books
            .filter((book) => {
                const query = search.toLowerCase();

                const matchesSearch =
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query) ||
                    book.category.toLowerCase().includes(query);

                const matchesCategory =
                    category === "All" || book.category === category;

                return matchesSearch && matchesCategory;
            })
            .sort((first, second) => {
                if (sortOrder === "low") {
                    return Number(first.price) - Number(second.price);
                }

                if (sortOrder === "high") {
                    return Number(second.price) - Number(first.price);
                }

                if (sortOrder === "title") {
                    return first.title.localeCompare(second.title);
                }

                return (
                    new Date(second.createdAt || 0) - new Date(first.createdAt || 0)
                );
            });
    }, [books, search, category, sortOrder]);

    const totalValue = books.reduce(
        (sum, book) => sum + Number(book.price || 0),
        0
    );

    const myBooks = books.filter(
        (book) =>
            book.createdBy?._id === user.id || book.createdBy === user.id
    ).length;

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Building your library...</p>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <Navbar />

            <main className="dashboard-page">
                <section className="dashboard-hero">
                    <div>
                        <p className="eyebrow">PERSONAL LIBRARY</p>
                        <h1>
                            Good afternoon, <span>{user.username || "Reader"}.</span>
                        </h1>
                        <p className="muted">
                            Your entire collection, beautifully organized in one place.
                        </p>
                    </div>

                    <Link className="primary-btn" to="/add-book">
                        + Add a new book
                    </Link>
                </section>

                <section className="metric-grid">
                    <div className="metric-card">
                        <span>📚</span>
                        <div>
                            <p>Total books</p>
                            <strong>{books.length}</strong>
                        </div>
                    </div>

                    <div className="metric-card">
                        <span>✦</span>
                        <div>
                            <p>Categories</p>
                            <strong>{Math.max(categories.length - 1, 0)}</strong>
                        </div>
                    </div>

                    <div className="metric-card">
                        <span>₹</span>
                        <div>
                            <p>Collection value</p>
                            <strong>₹{totalValue.toLocaleString("en-IN")}</strong>
                        </div>
                    </div>

                    <div className="metric-card">
                        <span>◎</span>
                        <div>
                            <p>Added by you</p>
                            <strong>{myBooks}</strong>
                        </div>
                    </div>
                </section>

                <section className="library-panel">
                    <div className="panel-top">
                        <div>
                            <h2>Your collection</h2>
                            <p>
                                {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"} currently visible
                            </p>
                        </div>

                        <button
                            className="refresh-btn"
                            onClick={() => {
                                setLoading(true);
                                fetchBooks();
                            }}
                        >
                            ↻ Refresh
                        </button>
                    </div>

                    <div className="toolbar">
                        <div className="search-box">
                            <span>⌕</span>
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search title, author or category..."
                            />
                        </div>

                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                        >
                            {categories.map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>

                        <select
                            value={sortOrder}
                            onChange={(event) => setSortOrder(event.target.value)}
                        >
                            <option value="newest">Newest first</option>
                            <option value="title">Title A–Z</option>
                            <option value="low">Price: low to high</option>
                            <option value="high">Price: high to low</option>
                        </select>
                    </div>

                    {message && <div className="error-banner">{message}</div>}

                    {filteredBooks.length ? (
                        <div className="books-container">
                            {filteredBooks.map((book) => (
                                <BookCard
                                    key={book._id}
                                    book={book}
                                    onDelete={(id) =>
                                        setBooks((previousBooks) =>
                                            previousBooks.filter((item) => item._id !== id)
                                        )
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div>📖</div>
                            <h3>No books found</h3>
                            <p>
                                Try changing your search or add a new book to your collection.
                            </p>
                            <button onClick={() => navigate("/add-book")}>
                                Add your first book
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
