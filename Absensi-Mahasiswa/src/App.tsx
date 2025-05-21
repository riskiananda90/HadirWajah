import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

// Pages
import Dashboard from "./Pages/Dashboard";
import Absensi from "./Pages/Absensi";
import Pelajaran from "./Pages/Pelajaran";
import Pengaturan from "./Pages/Pengaturan";
import Login from "./Pages/login";
import Register from "./Pages/Register";
import PageWrapper from "./Pages/Transisi";

// 1. Buat QueryClient di luar komponen
const queryClient = new QueryClient();
export default function App() {
  function ProtectedRoute({ children }: { children: React.ReactElement }) {
    const token = localStorage.getItem("auth_token");
    return token ? children : <Navigate to="/login" replace />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <PageWrapper children={<Dashboard />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/absensi"
            element={
              <ProtectedRoute>
                <PageWrapper children={<Absensi />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pelajaran"
            element={
              <ProtectedRoute>
                <PageWrapper children={<Pelajaran />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pengaturan"
            element={
              <ProtectedRoute>
                <PageWrapper children={<Pengaturan />} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
