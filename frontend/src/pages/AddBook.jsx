import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API_URL from "../api/api";

function AddBook() {
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
    const [loading, setLoading] = useState(false);

    const change = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const imageChange = (event) => {
        const file = event.target.files?.[0];
        setImage(file || null);
        setPreview(file ? URL.createObjectURL(file) : "");
    };

    const submit = async (event) => {
        event.preventDefault();

        if (!image) {
            setMessage("Please select a cover image");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);
        setMessage("");

        const form = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value);
        });

        form.append("image", image);

        try {
            const response = await fetch(`${API_URL}/book`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });

            const data = await response.json();

            if (data.success) {
                navigate("/dashboard");
            } else {
                setMessage(data.message || "Unable to add book");
            }
        } catch {
            setMessage("Unable to connect to the server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-shell">
            <Navbar />

            <main className="form-page-modern">
                <div className="form-breadcrumb">
                    <button onClick={() => navigate("/dashboard")}>
                        ← Back to library
                    </button>
                    <span>/</span>
                    <b>Add book</b>
                </div>

                <div className="form-layout">
                    <section className="form-intro">
                        <p className="eyebrow">EXPAND YOUR COLLECTION</p>
                        <h1>
                            Add a story
                            <br />
                            <span>worth keeping.</span>
                        </h1>
                        <p>
                            Build a rich digital library by adding complete book details and
                            a beautiful cover.
                        </p>

                        <div className="tip-card">
                            <span>✦</span>
                            <p>
                                <strong>Quick tip</strong>
                                <br />
                                Use a clear cover image for the best visual library experience.
                            </p>
                        </div>
                    </section>

                    <section className="book-form-card">
                        <div className="form-title">
                            <h2>Book details</h2>
                            <p>Fields marked with * are required.</p>
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
                                        placeholder="e.g. Atomic Habits"
                                        required
                                    />
                                </label>

                                <label>
                                    Author *
                                    <input
                                        name="author"
                                        value={formData.author}
                                        onChange={change}
                                        placeholder="Author name"
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
                                        placeholder="e.g. Self Help"
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
                                        placeholder="499"
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
                                    placeholder="Tell readers what makes this book special..."
                                    required
                                />
                            </label>

                            <div className="upload-zone">
                                <input
                                    id="cover-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={imageChange}
                                    required
                                />

                                <label htmlFor="cover-upload">
                                    {preview ? (
                                        <img src={preview} alt="Cover preview" />
                                    ) : (
                                        <>
                                            <span>↑</span>
                                            <strong>Upload book cover</strong>
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

                                <button className="primary-btn" disabled={loading}>
                                    {loading ? "Adding book..." : "Add to library →"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default AddBook;
