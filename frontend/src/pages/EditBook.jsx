import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API_URL from "../api/api";

function EditBook() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "",
        price: "",
        description: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadBook = async () => {
            try {
                const response = await fetch(`${API_URL}/book/${id}`);
                const data = await response.json();

                if (data.success) {
                    const book = data.data;

                    setFormData({
                        title: book.title || "",
                        author: book.author || "",
                        category: book.category || "",
                        price: book.price || "",
                        description: book.description || "",
                    });

                    if (book.image) {
                        setPreview(`${API_URL}/uploads/books/${book.image}`);
                    }
                } else {
                    setMessage(data.message || "Book not found");
                }
            } catch {
                setMessage("Unable to load book");
            } finally {
                setLoading(false);
            }
        };

        loadBook();
    }, [id]);

    const change = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const imageChange = (event) => {
        const file = event.target.files?.[0];
        setImage(file || null);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setMessage("");

        const form = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value);
        });

        if (image) {
            form.append("image", image);
        }

        try {
            const response = await fetch(`${API_URL}/book/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: form,
            });

            const data = await response.json();

            if (data.success) {
                navigate("/dashboard");
            } else {
                setMessage(data.message || "Unable to update book");
            }
        } catch {
            setMessage("Unable to connect to the server");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loader"></div>
                <p>Loading book details...</p>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <Navbar />

            <main className="form-page-modern">
                <div className="form-breadcrumb">
                    <button onClick={() => navigate("/dashboard")}>
                        ← Back to library
                    </button>
                    <span>/</span>
                    <b>Edit book</b>
                </div>

                <div className="form-layout">
                    <section className="form-intro">
                        <p className="eyebrow">REFINE YOUR COLLECTION</p>
                        <h1>
                            Keep every
                            <br />
                            <span>detail current.</span>
                        </h1>
                        <p>
                            Update your book information and make your library even more
                            useful.
                        </p>
                    </section>

                    <section className="book-form-card">
                        <div className="form-title">
                            <h2>Edit book</h2>
                            <p>Make your changes and save when you're ready.</p>
                        </div>

                        {message && <div className="error-banner">{message}</div>}

                        <form onSubmit={submit} className="modern-form">
                            <div className="field-grid">
                                <label>
                                    Book title *
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={change}
                                        required
                                    />
                                </label>

                                <label>
                                    Author *
                                    <input
                                        name="author"
                                        value={formData.author}
                                        onChange={change}
                                        required
                                    />
                                </label>
                            </div>

                            <div className="field-grid">
                                <label>
                                    Category *
                                    <input
                                        name="category"
                                        value={formData.category}
                                        onChange={change}
                                        required
                                    />
                                </label>

                                <label>
                                    Price (₹) *
                                    <input
                                        type="number"
                                        min="0"
                                        name="price"
                                        value={formData.price}
                                        onChange={change}
                                        required
                                    />
                                </label>
                            </div>

                            <label>
                                Description *
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={change}
                                    required
                                />
                            </label>

                            <div className="upload-zone">
                                <input
                                    id="edit-cover"
                                    type="file"
                                    accept="image/*"
                                    onChange={imageChange}
                                />

                                <label htmlFor="edit-cover">
                                    {preview ? (
                                        <img src={preview} alt="Book cover" />
                                    ) : (
                                        <>
                                            <span>↑</span>
                                            <strong>Upload a new cover</strong>
                                            <small>PNG, JPG or WEBP</small>
                                        </>
                                    )}
                                </label>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Cancel
                                </button>

                                <button className="primary-btn" disabled={saving}>
                                    {saving ? "Saving changes..." : "Save changes →"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default EditBook;
