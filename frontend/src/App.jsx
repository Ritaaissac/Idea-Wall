import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import CriarQuadro from "./pages/CriarQuadro";
import Perfil from "./pages/Perfil";
import Tarefas from "./pages/Tarefas";
import Quadros from "./pages/Quadros";

import { ProtectedRoute } from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        <Route
          path="/quadros"
          element={
            <ProtectedRoute>
              <Quadros />
            </ProtectedRoute>
          }
        />

        <Route
          path="/criar-quadro"
          element={
            <ProtectedRoute>
              <CriarQuadro />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tarefas/:quadroId"
          element={
            <ProtectedRoute>
              <Tarefas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;