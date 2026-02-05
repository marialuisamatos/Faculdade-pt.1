function registrarPonto() {
    const usuarioInput = document.getElementById('usuario');
    const usuario = usuarioInput.value.trim();
    const statusElement = document.getElementById('status');
    
    if (!usuario) {
        statusElement.textContent = "Por favor, insira o identificador do usuário.";
        return;
    }

    const pontos = JSON.parse(localStorage.getItem('pontos')) || {};
    
    if (!pontos[usuario]) {
        pontos[usuario] = [];
    }

    const limiteHoras = 20;
    const agora = new Date();
    const agoraISO = agora.toISOString();
    
    const horasTrabalhadas = calcularHorasTrabalhadas(pontos[usuario]);
    
    if (horasTrabalhadas >= 20) {
        statusElement.textContent = "Você atingiu o limite de 20 horas. Não é possível registrar mais pontos.";
        usuarioInput.disabled = true; 
    } else {
        statusElement.textContent = `Horas trabalhadas: ${horasTrabalhadas.toFixed(2)} horas.`;
        usuarioInput.disabled = false; 
    }

    pontos[usuario].push(agoraISO);
    localStorage.setItem('pontos', JSON.stringify(pontos));

    inicializarEstadoUsuario();
    
    statusElement.textContent = `Ponto registrado para o usuário ${usuario} em ${agoraISO}`;
}

function calcularHorasTrabalhadas(registros) {
    let totalSegundos = 0;
    
    if (registros.length % 2 !== 0) {
        registros.pop(); 
    }
    
    for (let i = 0; i < registros.length; i += 2) {
        const entrada = new Date(registros[i]);
        const saida = new Date(registros[i + 1]);
        totalSegundos += (saida - entrada) / 1000;
    }

    return totalSegundos / 3600; 
}

function inicializarEstadoUsuario() {
    const usuarioInput = document.getElementById('usuario');
    const usuario = usuarioInput.value.trim();
    const statusElement = document.getElementById('status');
    
    if (!usuario) {
        return;
    }
    
    const pontos = JSON.parse(localStorage.getItem('pontos')) || {};
    
    if (!pontos[usuario]) {
        pontos[usuario] = [];
    }

    const horasTrabalhadas = calcularHorasTrabalhadas(pontos[usuario]);
      
}

document.addEventListener('DOMContentLoaded', inicializarEstadoUsuario);

