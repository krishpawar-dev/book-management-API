import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-book"
        element={
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-book/:id"
        element={
          <ProtectedRoute>
            <EditBook />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;