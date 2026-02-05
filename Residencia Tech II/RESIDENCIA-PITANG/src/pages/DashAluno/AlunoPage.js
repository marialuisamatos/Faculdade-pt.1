import React, { useEffect, useState } from "react";
import "./AlunoPage.css";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import atividadesService from "../../services/atividades";

const Home = () => {
  const navigate = useNavigate();
  const [atividades, setAtividades] = useState([]); // Lista completa de atividades
  const [atividadesPendentes, setAtividadesPendentes] = useState([]); // Lista filtrada de atividades pendentes
  const [atividadesDevolvidas, setAtividadesDevolvidas] = useState([]); // Lista de atividades devolvidas

  // Função para comparar listas e atualizar atividades pendentes
  const atualizarAtividadesPendentes = (atividades, atividadesDevolvidas) => {
    const idsDevolvidas = new Set(atividadesDevolvidas.map((a) => a.id)); // Cria um conjunto de IDs devolvidos
    const pendentes = atividades.filter((atividade) => !idsDevolvidas.has(atividade.id)); // Filtra as atividades não devolvidas
    setAtividadesPendentes(pendentes); // Atualiza o estado com as pendentes
  };

  // Carregar atividades pendentes
  useEffect(() => {
    const fetchAtividades = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          console.error("Token não encontrado. Faça login novamente.");
          return;
        }

        const response = await fetch("https://ferasapi.serveo.net/atividades", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setAtividades(data); // Atualiza a lista completa de atividades
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
      }
    };

    fetchAtividades();
  }, []);

  // Carregar atividades devolvidas
  useEffect(() => {
    const fetchAtividadesDevolvidas = async () => {
      try {
        const data = await atividadesService.getAtividadesDevolvidas();
        setAtividadesDevolvidas(data); // Atualiza a lista de atividades devolvidas
      } catch (error) {
        console.error("Erro ao carregar atividades devolvidas:", error);
      }
    };

    fetchAtividadesDevolvidas();
  }, []);

  // Atualizar atividades pendentes sempre que listas mudarem
  useEffect(() => {
    atualizarAtividadesPendentes(atividades, atividadesDevolvidas);
  }, [atividades, atividadesDevolvidas]);

  // Função chamada ao clicar em uma atividade pendente
  const handleAtividadeClick = (atividade) => {
    navigate("/responder-atividade", { state: { atividade } });
  };

  return (
    <div className="container">
      <main className="content">
        <header>
          <h1>Bem-vindo, Aluno!</h1>
        </header>

        {/* Seção de Atividades Disponíveis (Pendentes) */}
        <section className="activities-section">
          <h2>Atividades Pendentes</h2>
          {atividadesPendentes.length > 0 ? (
            atividadesPendentes.map((atividade, index) => (
              <div
                key={index}
                className="activity-card"
                onClick={() => handleAtividadeClick(atividade)}
              >
                <h3>{atividade.titulo}</h3>
                <p>{atividade.questoes?.pergunta || ""}</p>
              </div>
            ))
          ) : (
            <p>Nenhuma atividade pendente no momento.</p>
          )}
        </section>

        {/* Seção de Atividades Devolvidas (Respondidas) */}
        <section className="activities-devolvidas-section">
          <h2>Atividades Respondidas</h2>
          {atividadesDevolvidas.length > 0 ? (
            atividadesDevolvidas.map((atividadeDevolvida, index) => (
              <div key={index} className="activity-card">
                <h3>{atividadeDevolvida.tituloAtividade}</h3>
                <p>Nota: {atividadeDevolvida.nota || "Ainda sem nota"}</p>
              </div>
            ))
          ) : (
            <p>Nenhuma atividade respondida ainda.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
