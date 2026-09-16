import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/dashboard");
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
                    <p className="eyebrow">WELCOME BACK</p>
                    <h1>
                        Continue your
                        <br />
                        <span>reading journey.</span>
                    </h1>
                    <p>
                        Access your personal library and keep every great story organized.
                    </p>
                </div>

                <div className="auth-quote">
                    “A reader lives a thousand lives before he dies.”
                </div>
            </div>

            <section className="auth-panel">
                <div className="auth-box">
                    <p className="eyebrow">SECURE ACCESS</p>
                    <h2>Welcome back</h2>
                    <p>Sign in to manage your collection.</p>

                    {message && <div className="error-banner">{message}</div>}

                    <form onSubmit={submit} className="modern-form">
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
                                placeholder="Enter your password"
                                required
                            />
                        </label>

                        <button className="primary-btn full-btn" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in →"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        New to BookVault? <Link to="/register">Create an account</Link>
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Login;
