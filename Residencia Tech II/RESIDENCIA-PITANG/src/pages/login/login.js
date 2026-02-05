// src/components/Login/Login.js
import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Chama o serviço de login
      const data = await authService.login(email, password);

      // Log para visualizar os dados retornados após o login
      console.log("Dados retornados após login:", data);

      const { access_token, type } = data; // Pega o token e o tipo de usuário

      // Verificar se o token foi armazenado corretamente
      const storedToken = authService.getToken(); // Usando a função getToken
      console.log("Token armazenado no localStorage após login:", storedToken);

      if (type === "TEACHER") {
        navigate("/professor");
      } else if (type === "STUDENT") {
        navigate("/aluno");
      } else {
        setError("Usuário não cadastrado.");
      }
    } catch (err) {
      setError("E-mail ou Senha Inválidos.");
      console.error(err); // Logar o erro
    }
  };

  return (
    <div className="body-login">
      <div className="container-login">
        <h1>Login</h1>
        <form className="formRegist" onSubmit={handleLogin}>
          <div>
            <input
              id="email"
              type="email"
              placeholder="Digite seu E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p style={{ color: "white" }}>⚠️ {error}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
