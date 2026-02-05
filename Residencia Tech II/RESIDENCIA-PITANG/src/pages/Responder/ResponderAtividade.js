import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from "../../services/authService"; // Para pegar o token
import './ResponderAtividade.css';

const ResponderAtividade = () => {
  const navigate = useNavigate();
  const { state: { atividade } } = useLocation();
  const [respostas, setRespostas] = useState(
    atividade?.questoes.map(questao => ({
      perguntaId: questao.id,
      resposta: ''
    })) || []
  );

  // Função para atualizar as respostas
  const handleRespostaChange = (perguntaId, resposta) => {
    setRespostas(prevRespostas =>
      prevRespostas.map(r =>
        r.perguntaId === perguntaId ? { ...r, resposta } : r
      )
    );
  };

  // Enviar respostas para a API
  const handleEnviarResposta = async () => {
    const token = authService.getToken(); // Obtém o token do authService
    if (!token) {
      alert("Usuário não autenticado. Faça login novamente.");
      return;
    }

    const respostasFormatadas = respostas; // API espera { perguntaId, resposta }

    try {
      const response = await fetch(
        `https://ferasapi.serveo.net/atividades/${atividade.id}/devolver`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ respostas: respostasFormatadas })
        }
      );

      if (response.ok) {
        alert("Respostas enviadas com sucesso!");
        navigate('/aluno'); // Redireciona para a página do aluno
      } else {
        const errorData = await response.json();
        console.error("Erro ao enviar respostas:", errorData);
        alert("Erro ao enviar respostas. Verifique as informações e tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
      alert("Erro ao conectar com a API.");
    }
  };

  const handleVoltar = () => {
    navigate('/aluno'); // Redireciona para a Home
  };

  return (
    <div className="container">
      <main className="content">
        <header>
          <h1>Responder Atividade</h1>
          <button onClick={handleVoltar} className="btn-voltar">
            Voltar
          </button>
        </header>

        <section className="atividade-detalhes">
          <h2>{atividade?.titulo || "Título da Atividade"}</h2>
        </section>

        <section className="responder-secao">
          {atividade?.questoes.map((questao, index) => (
            <div key={index}>
              <h6>{questao.pergunta}</h6>
              <textarea
                value={respostas.find(r => r.perguntaId === questao.id)?.resposta || ""}
                onChange={(e) => handleRespostaChange(questao.id, e.target.value)}
                placeholder="Digite sua resposta aqui..."
              />
            </div>
          ))}
          <button onClick={handleEnviarResposta} className="btn-enviar">
            Enviar Resposta
          </button>
        </section>
      </main>
    </div>
  );
};

export default ResponderAtividade;
