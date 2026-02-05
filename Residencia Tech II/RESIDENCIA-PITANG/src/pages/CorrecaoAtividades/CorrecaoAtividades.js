import React, { useEffect, useState } from "react";
import "./CorrecaoAtividades.css";
import { AiOutlineCheckCircle } from "react-icons/ai"; // Ícone de check
import atividadesService from "../../services/atividades";
import { useNavigate } from "react-router-dom";

const CorrecaoAtividades = () => {
  const [atividadesDevolvidas, setAtividadesDevolvidas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAtividadesDevolvidas = async () => {
      try {
        const data = await atividadesService.getAtividadesDevolvidas();
        setAtividadesDevolvidas(data);
      } catch (error) {
        console.error("Erro ao carregar atividades devolvidas:", error);
      }
    };

    fetchAtividadesDevolvidas();
  }, []);

  const handleVoltar = () => {
    navigate("/professor"); // Redireciona para a página do professor
  };

  const handleAtividadeClick = (atividade) => {
    navigate("/dar-nota", { state: { atividade } }); // Passa os dados para a página DarNota.js
  };

  return (
    <div className="container">
      <main className="content">
        <header>
          <h1>Correção de Atividades</h1>
        </header>

        <section className="activities-section">
          <h2>Atividades Devolvidas</h2>
          {atividadesDevolvidas.length > 0 ? (
            atividadesDevolvidas.map((atividade, index) => (
              <div
                key={index}
                className="activity-card"
                onClick={() => handleAtividadeClick(atividade)}
              >
                <h3>
                  {atividade.tituloAtividade || "Sem título"}
                  {atividade.nota && (
                    <AiOutlineCheckCircle
                      className="check-icon"
                      title="Nota atribuída"
                    />
                  )}
                </h3>
                <p>Aluno: {atividade.nomeUsuario || "Desconhecido"}</p>
                {atividade.nota && <p>Nota atribuída: {atividade.nota}</p>}
              </div>
            ))
          ) : (
            <p>Nenhuma atividade devolvida no momento.</p>
          )}
        </section>

        <footer className="footer">
          <button className="btn-voltar" onClick={handleVoltar}>
            Voltar
          </button>
        </footer>
      </main>
    </div>
  );
};

export default CorrecaoAtividades;
