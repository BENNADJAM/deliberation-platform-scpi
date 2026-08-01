import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentsPage";
import ResultsPage from "./pages/ResultsPage";
import GradesPage from "./pages/GradesPage";
import ReportsPage from "./pages/ReportsPage";
import SubjectsPage from "./pages/SubjectsPage";
import ClassesPage from "./pages/ClassesPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import { useAuth } from "./contexts/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute requiredRole="admin"><DashboardPage /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute requiredRole="admin"><StudentsPage /></ProtectedRoute>} />
      <Route path="/results" element={<ProtectedRoute requiredRole="admin"><ResultsPage /></ProtectedRoute>} />
      <Route path="/grades" element={<ProtectedRoute requiredRole="admin"><GradesPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute requiredRole="admin"><ReportsPage /></ProtectedRoute>} />
      <Route path="/subjects" element={<ProtectedRoute requiredRole="admin"><SubjectsPage /></ProtectedRoute>} />
      <Route path="/classes" element={<ProtectedRoute requiredRole="admin"><ClassesPage /></ProtectedRoute>} />
      <Route path="/student-dashboard" element={<ProtectedRoute requiredRole="student"><StudentDashboardPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

