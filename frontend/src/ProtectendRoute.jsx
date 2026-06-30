import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Se não houver token, barra o usuário e joga para o login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, renderiza a página normalmente
  return children;
};