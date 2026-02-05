    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import './CadastroAtividades.css';
    import atividadesService from "../../services/atividades";

    function CadastroAtividades() {
        const navigate = useNavigate();
        const [titulo, setTitulo] = useState('');
        const [questoes, setQuestoes] = useState(['']);

        const handleBack = () => {
            navigate(-1);
        };

        const adicionarQuestao = () => {
            setQuestoes([...questoes, '']);
        };

        const removerQuestao = (index) => {
            const novasQuestoes = questoes.filter((_, i) => i !== index);
            setQuestoes(novasQuestoes);
        };

        const atualizarQuestao = (index, texto) => {
            const novasQuestoes = [...questoes];
            novasQuestoes[index] = texto;
            setQuestoes(novasQuestoes);
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                const atividade = {
                    titulo,
                    questoes: questoes.map((pergunta) => ({ pergunta }))
                };
                await atividadesService.cadastrarAtividade(atividade);

                alert('Atividade cadastrada com sucesso!');
                setTitulo('');
                setQuestoes(['']);
            } catch (error) {
                console.error("Erro ao cadastrar atividade:", error.response?.data || error.message);
                alert("Erro ao cadastrar atividade. Verifique se está logado e tente novamente.");
            }
        };

        return (
            <div className="container">
                <div className="content">
                    <button onClick={handleBack} className="voltar">Voltar</button>
                    <h2>Cadastrar Atividade</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Título da Atividade:</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                        />

                        <h3>Questões</h3>
                        {questoes.map((questao, index) => (
                            <div key={index} className="questao-container">
                                <input
                                    type="text"
                                    value={questao}
                                    onChange={(e) => atualizarQuestao(index, e.target.value)}
                                    placeholder={`Questão ${index + 1}`}
                                    required
                                />
                                <button type="button" onClick={() => removerQuestao(index)}>Remover</button>
                            </div>
                        ))}
                        <button type="button" onClick={adicionarQuestao}>Adicionar Questão</button>

                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            </div>
        );
    }

    export default CadastroAtividades;
