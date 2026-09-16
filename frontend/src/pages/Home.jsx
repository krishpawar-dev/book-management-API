import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
    const loggedIn = Boolean(localStorage.getItem("token"));

    const features = [
        [
            "⌕",
            "Smart discovery",
            "Search instantly by title, author or category and filter your collection with ease.",
        ],
        [
            "↗",
            "Full control",
            "Create, update and remove books with ownership-based authorization.",
        ],
        [
            "◈",
            "Visual library",
            "Give every title its own cover image for a collection that feels alive.",
        ],
        [
            "⚡",
            "Fast workflow",
            "Clean forms, responsive design and a dashboard built for daily use.",
        ],
    ];

    return (
        <div className="home-shell">
            <Navbar />

            <main>
                <section className="hero-modern">
                    <div className="hero-copy">
                        <div className="eyebrow">✦ YOUR SMART DIGITAL LIBRARY</div>

                        <h1>
                            Organize every <span>great story.</span>
                        </h1>

                        <p>
                            BookVault transforms your collection into a beautiful, searchable
                            and secure personal library. Add, discover and manage every book
                            from one polished workspace.
                        </p>

                        <div className="hero-actions">
                            <Link
                                className="primary-btn"
                                to={loggedIn ? "/dashboard" : "/register"}
                            >
                                {loggedIn ? "Open my library" : "Start building free"} <span>→</span>
                            </Link>

                            {!loggedIn && (
                                <Link className="secondary-btn" to="/login">
                                    I already have an account
                                </Link>
                            )}
                        </div>

                        <div className="trust-row">
                            <span>✓ JWT secured</span>
                            <span>✓ Image uploads</span>
                            <span>✓ Smart search</span>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="glow"></div>
                        <div className="floating-note note-one">✦ 100% organized</div>

                        <div className="book-stack">
                            <div className="cover cover-one">
                                BOOK
                                <br />
                                VAULT
                            </div>
                            <div className="cover cover-two">
                                YOUR
                                <br />
                                LIBRARY
                            </div>
                            <div className="cover cover-three">
                                GREAT
                                <br />
                                STORIES
                            </div>
                        </div>

                        <div className="visual-card">
                            <span>Collection overview</span>
                            <strong>Everything in one place.</strong>
                            <div className="mini-bars">
                                <i></i>
                                <i></i>
                                <i></i>
                                <i></i>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="home-stats">
                    <div>
                        <strong>01</strong>
                        <span>Beautiful workspace</span>
                    </div>
                    <div>
                        <strong>02</strong>
                        <span>Secure authentication</span>
                    </div>
                    <div>
                        <strong>03</strong>
                        <span>Full CRUD management</span>
                    </div>
                    <div>
                        <strong>04</strong>
                        <span>Image based collection</span>
                    </div>
                </section>

                <section className="feature-section">
                    <div className="section-intro">
                        <div className="eyebrow">BUILT FOR BETTER ORGANIZATION</div>
                        <h2>
                            More than a simple
                            <br />
                            <span>book list.</span>
                        </h2>
                    </div>

                    <div className="feature-grid">
                        {features.map(([icon, title, text], index) => (
                            <div className="feature-card" key={title}>
                                <span className="feature-no">0{index + 1}</span>
                                <div className="feature-icon">{icon}</div>
                                <h3>{title}</h3>
                                <p>{text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="workflow">
                    <div>
                        <div className="eyebrow">HOW IT WORKS</div>
                        <h2>
                            From empty shelf
                            <br />
                            to organized library.
                        </h2>
                    </div>

                    <div className="workflow-steps">
                        <div>
                            <b>01</b>
                            <h3>Create account</h3>
                            <p>Register and securely access your personal workspace.</p>
                        </div>
                        <div>
                            <b>02</b>
                            <h3>Add your books</h3>
                            <p>Upload covers and save all important book information.</p>
                        </div>
                        <div>
                            <b>03</b>
                            <h3>Manage smarter</h3>
                            <p>Search, filter, update and curate your growing collection.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                BookVault <span>•</span> A modern Book Management System
            </footer>
        </div>
    );
}

export default Home;
