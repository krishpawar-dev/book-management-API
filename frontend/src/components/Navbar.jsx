import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isLoggedIn = Boolean(localStorage.getItem("token"));

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const linkClass = (path) =>
        `nav-link ${location.pathname === path ? "active" : ""}`;

    return (
        <header className="topbar">
            <Link to="/" className="brand">
                <span className="brand-mark">B</span>
                <span>
                    Book<span>Vault</span>
                </span>
            </Link>

            <nav className="nav-links">
                <Link className={linkClass("/")} to="/">
                    Home
                </Link>

                {isLoggedIn && (
                    <Link className={linkClass("/dashboard")} to="/dashboard">
                        Library
                    </Link>
                )}

                {isLoggedIn && (
                    <Link className={linkClass("/add-book")} to="/add-book">
                        Add Book
                    </Link>
                )}
            </nav>

            <div className="nav-user">
                {isLoggedIn ? (
                    <>
                        <div className="avatar">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="user-name">{user?.username || "Reader"}</span>
                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-btn">
                            Sign in
                        </Link>
                        <Link to="/register" className="nav-cta">
                            Get started
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Navbar;
