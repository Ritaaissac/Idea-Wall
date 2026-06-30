import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Quadros from "./pages/Quadros";
import CriarQuadro from "./pages/Criarquadro";
import Perfil from "./pages/Perfil";

import { ProtectedRoute } from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas Privadas (Protegidas) */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/quadros" 
          element={<ProtectedRoute><Quadros /></ProtectedRoute>} 
        />
        <Route 
          path="/criar-quadro" 
          element={<ProtectedRoute><CriarQuadro /></ProtectedRoute>} 
        />
        <Route 
          path="/perfil" 
          element={<ProtectedRoute><Perfil /></ProtectedRoute>} 
        />

        {/* Rota de segurança: se digitar qualquer outra coisa, manda pro login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;