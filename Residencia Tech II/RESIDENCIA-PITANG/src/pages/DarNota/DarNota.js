import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import atividadesService from "../../services/atividades";
import './DarNota.css';

const DarNota = () => {
  const location = useLocation(); // Recebe dados da navegação
  const navigate = useNavigate();
  const { atividade } = location.state || {}; // Recupera os dados da atividade selecionada
  console.log("Atividade recebida:", atividade);

  const [nota, setNota] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleNotaChange = (e) => {
    const value = e.target.value;
    if (value === "" || (value >= 0 && value <= 10)) {
      setNota(value);
    } else if (value > 10) {
      setNota(10); // Ajusta automaticamente para 10 caso exceda o limite
    }
  };

  const handleAtribuirNota = async () => {
    try {
      if (!nota || isNaN(nota)) {
        setMensagem("Insira uma nota válida.");
        return;
      }

      await atividadesService.atribuirNota(atividade.id, { nota: parseFloat(nota) });
      setMensagem("Nota atribuída com sucesso!");
    } catch (error) {
      console.error("Erro ao atribuir nota:", error);
      setMensagem("Erro ao atribuir nota. Tente novamente.");
    }
  };

  return (
    <div className="container">
      <h1>Atribuir Nota</h1>
      {atividade ? (
        <>
          <h2>Atividade: {atividade.tituloAtividade}</h2>
          <h3>Aluno: {atividade.nomeUsuario}</h3>

          <section>
            <h4>Respostas do Aluno:</h4>
            {atividade.respostas && atividade.respostas.length > 0 ? (
              atividade.respostas.map((resposta, index) => (
                <div key={index} className="response-card">
                  {/* Índice adicionado antes da resposta */}
                  <p>
                    {index + 1}) {resposta.resposta || "Resposta não disponível."}
                  </p>
                </div>
              ))
            ) : (
              <p>Carregando respostas...</p>
            )}
          </section>

          <section>
            <h4>Atribuir Nota</h4>
            <input
              type="number"
              value={nota}
              onChange={handleNotaChange}
              placeholder="Insira a nota"
              className="nota-input"
              min="0"
              max="10" // HTML5 Constraint para reforçar o limite no navegador
            />
            <button onClick={handleAtribuirNota} className="btn-atribuir-nota">
              Salvar Nota
            </button>
            {mensagem && <p className="mensagem">{mensagem}</p>}
          </section>
        </>
      ) : (
        <p>Nenhuma atividade selecionada. Volte para a página anterior.</p>
      )}

      <button onClick={() => navigate("/correcao")} className="btn-voltar">
        Voltar
      </button>
    </div>
  );
};

export default DarNota;
