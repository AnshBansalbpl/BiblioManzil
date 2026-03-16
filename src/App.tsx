import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Blogs from "./pages/Blogs";
import Library from "./pages/Library";
import Summaries from "./pages/Summaries";
import Reels from "./pages/Reels";
import Dashboard from "./pages/Dashboard";
import BlogDetail from "./pages/BlogDetail";
import BookDetail from "./pages/BookDetail";
import SummaryDetail from "./pages/SummaryDetail";
import { AuthProvider, useAuth } from "./context/AuthContext";

/* Admin UID list */
const ADMIN_UIDS = [
  "OxnFp3sTFXYAbu37vTAURkXpe5U2",
  "khD5KPx262ZVwHqVyQBONTDvY5K2"
];

/* Route protection for logged-in users */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

/* Admin-only route */
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  /* Check if user UID exists in admin list */
  if (!ADMIN_UIDS.includes(user.uid)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/summaries" element={<Summaries />} />
              <Route path="/summary/:id" element={<SummaryDetail />} />
              <Route path="/ebooks" element={<Library />} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/reels" element={<Reels />} />

              {/* Admin only route */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
