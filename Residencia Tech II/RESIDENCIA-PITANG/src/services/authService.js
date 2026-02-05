// src/services/authService.js
import axios from "axios";

const API_URL = "https://ferasapi.serveo.net/auth/";

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, { email, password });
    
    // Log para visualizar toda a resposta da API
    console.log("Resposta completa da API:", response.data);

    // Agora estamos acessando 'access_token' corretamente
    const { access_token, type } = response.data; 

    if (access_token) {
      console.log("Token recebido:", access_token);  
      localStorage.setItem("authToken", access_token); // Armazena o token no localStorage
    } else {
      console.log("Nenhum token retornado na resposta.");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

const getToken = () => {
  const token = localStorage.getItem("authToken");
  console.log("Token no localStorage:", token);  // Verifique o token armazenado no localStorage
  return token;
};

export default { login, getToken };
