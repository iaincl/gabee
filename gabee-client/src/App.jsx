import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LogBrew from "./pages/LogBrew";
import LogDrink from "./pages/LogDrink";
import History from "./pages/History";


const isLoggedIn = () => !!localStorage.getItem("token");

const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/log-brew" element={<ProtectedRoute><LogBrew /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/log-drink" element={<ProtectedRoute><LogDrink /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
    </Routes>
  );
}