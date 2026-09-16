import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const change = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(`${API_URL}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                navigate("/login");
            } else {
                setMessage(data.message);
            }
        } catch {
            setMessage("Unable to connect to the server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-side">
                <Link to="/" className="brand">
                    <span className="brand-mark">B</span>
                    <span>
                        Book<span>Vault</span>
                    </span>
                </Link>

                <div>
                    <p className="eyebrow">START YOUR COLLECTION</p>
                    <h1>
                        Your library,
                        <br />
                        <span>your way.</span>
                    </h1>
                    <p>
                        Create a secure space for every book you want to remember, revisit
                        and manage.
                    </p>
                </div>

                <div className="auth-benefits">
                    <span>✓ Personal dashboard</span>
                    <span>✓ Image uploads</span>
                    <span>✓ Full book management</span>
                </div>
            </div>

            <section className="auth-panel">
                <div className="auth-box">
                    <p className="eyebrow">CREATE ACCOUNT</p>
                    <h2>Join BookVault</h2>
                    <p>Start building your digital library today.</p>

                    {message && <div className="error-banner">{message}</div>}

                    <form onSubmit={submit} className="modern-form">
                        <label>
                            Username
                            <input
                                name="username"
                                value={formData.username}
                                onChange={change}
                                placeholder="Choose a username"
                                required
                            />
                        </label>

                        <label>
                            Email address
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={change}
                                placeholder="you@example.com"
                                required
                            />
                        </label>

                        <label>
                            Password
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={change}
                                placeholder="Create a password"
                                required
                                minLength="6"
                            />
                        </label>

                        <button className="primary-btn full-btn" disabled={loading}>
                            {loading ? "Creating account..." : "Create account →"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already a member? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Register;
