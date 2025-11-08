// ==================== CONFIGURAÇÃO DO BOTPRESS ====================

const BOTPRESS_EMBEDS = {
  'https://exemplo.com/grupo1': {
    grupo: 'grupo1',
    inject_script: 'https://cdn.botpress.cloud/webchat/v3.3/inject.js',
    config_script: 'https://files.bpcontent.cloud/2025/11/08/01/20251108015936-6WGCXIL1.js',
    container_id: 'bp-embedded-webchat'
  },
  'https://exemplo.com/grupo2': {
    grupo: 'grupo2',
    inject_script: 'https://cdn.botpress.cloud/webchat/v3.3/inject.js',
    config_script: 'https://files.bpcontent.cloud/2025/11/08/01/OUTRO-ID-GRUPO2.js',
    container_id: 'bp-embedded-webchat'
  },
  'https://exemplo.com/grupo3': {
    grupo: 'grupo3',
    inject_script: 'https://cdn.botpress.cloud/webchat/v3.3/inject.js',
    config_script: 'https://files.bpcontent.cloud/2025/11/08/01/TERCEIRO-ID-GRUPO3.js',
    container_id: 'bp-embedded-webchat'
  }
};


const GIST_URL = 'https://gist.githubusercontent.com/nutinf-sedap/131c5b754b130eebe369c84350114016/raw/';
const RANDOM_NAMES_COUNT = 4;

// ==================== ESTADO GLOBAL ====================

let state = {
  currentCpf: null,
  matchedUsers: [],
  selectedName: null,
  isLocked: false,
  lockEndTime: null,
  cpfExists: false,
  currentGroupKey: null // Para saber qual grupo está ativo
};

// Lista de nomes aleatórios
let randomNamesList = [];

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', () => {
  loadRandomNamesList();
  setupEventListeners();
  checkIfLocked();
});

// ==================== CARREGAMENTO DE DADOS ====================

async function loadRandomNamesList() {
  try {
    randomNamesList = getDefaultRandomNamesList();
  } catch (error) {
    console.error('Erro ao carregar lista de nomes:', error);
    randomNamesList = getDefaultRandomNamesList();
  }
}

function getDefaultRandomNamesList() {
  return [
    'Roberto', 'Carlos', 'Francisco', 'Antonio', 'Marcos', 'Alexandre', 'Felipe', 'Diego',
    'Bruno', 'Ricardo', 'Rodrigo', 'Gustavo', 'Lucas', 'Daniel', 'Rafael', 'Fernando',
    'Sergio', 'Paulo', 'Luis', 'Fabio', 'Claudio', 'Marcelo', 'Mateus', 'Andre',
    'Edson', 'Leandro', 'Thiago', 'Mauricio', 'Gabriel', 'Henrique', 'Leonardo', 'Samuel',
    'Gilson', 'Denis', 'Otavio', 'Vinicius', 'Joao', 'Jose', 'Manuel', 'Vicente',
    'Inacio', 'Anselmo', 'Apolonio', 'Ariosto', 'Armando', 'Arnaldo', 'Artemio', 'Augusto',
    'Aurelio', 'Aureliano', 'Avelino', 'Ayrton', 'Baltasar', 'Baltazar', 'Belmiro', 'Beltrão',
    'Benedito', 'Benilson', 'Beno', 'Benoni', 'Benvenuto', 'Berilo', 'Brinaldo', 'Brás',
    'Ana', 'Beatriz', 'Carla', 'Daniela', 'Elisa', 'Fernanda', 'Gabriela', 'Heloisa',
    'Iris', 'Joana', 'Katarina', 'Laura', 'Mariana', 'Natalia', 'Olivia', 'Patricia',
    'Rafaela', 'Simone', 'Tatiana', 'Ursula', 'Vanessa', 'Wanda', 'Yasmin', 'Zelia',
    'Abigail', 'Adriana', 'Agatha', 'Agostinha', 'Aida', 'Amanda', 'Angelica', 'Aparecida',
    'Augusta', 'Barbara', 'Bianca', 'Bruna', 'Camila', 'Carolina', 'Cecilia', 'Celia',
    'Clara', 'Claudia', 'Cristina', 'Debora', 'Denise', 'Diana', 'Eduarda', 'Elena',
    'Elisabete', 'Emilia', 'Erica', 'Esther', 'Fabiana', 'Fatima', 'Flavia', 'Flora',
    'Francisca', 'Gisele', 'Gloria', 'Graciela', 'Helena', 'Ines', 'Isabel', 'Ivone',
    'Jacqueline', 'Janaina', 'Josefa', 'Julia', 'Juliana', 'Karina', 'Lara', 'Larissa',
    'Leticia', 'Lia', 'Lidia', 'Lilian', 'Lorena', 'Lucia', 'Luciana', 'Luisa',
    'Madalena', 'Manuela', 'Marcela', 'Marcia', 'Margareth', 'Marta', 'Melissa', 'Michele',
    'Miriam', 'Monica', 'Nadia', 'Neusa', 'Nina', 'Norma', 'Odete', 'Olga',
    'Pamela', 'Paula', 'Priscila', 'Raquel', 'Regina', 'Renata', 'Rita', 'Roberta',
    'Rosa', 'Rosana', 'Rosangela', 'Sandra', 'Sara', 'Silvia', 'Sofia', 'Sonia',
    'Stella', 'Sueli', 'Suzana', 'Tania', 'Teresa', 'Valeria', 'Vera', 'Veronica',
    'Vitoria', 'Viviane', 'Yara', 'Yolanda'
  ];
}

// ==================== CONFIGURAÇÃO DE EVENTOS ====================

function setupEventListeners() {
  const cpfInput = document.getElementById('cpf-input');
  const btnSearch = document.getElementById('btn-search');
  const cpfBackground = document.querySelector('.cpf-background');
  
  cpfInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    document.getElementById('error-cpf').textContent = '';
    
    if (e.target.value.length > 0) {
      cpfBackground.classList.add('hidden');
    } else {
      cpfBackground.classList.remove('hidden');
    }
  });
  
  cpfInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && cpfInput.value.length === 4) {
      searchCpf();
    }
  });
  
  btnSearch.addEventListener('click', searchCpf);
  document.getElementById('btn-confirm-name').addEventListener('click', confirmName);
  document.getElementById('btn-back-to-cpf').addEventListener('click', backToCpf);
  document.getElementById('btn-logout-chat').addEventListener('click', backToCpf);
  document.getElementById('btn-retry').addEventListener('click', backToCpf);
  
  document.querySelector('.privacy-link').addEventListener('click', (e) => {
    e.preventDefault();
  });
}

// ==================== FUNÇÕES DE TELA ====================

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}

// ==================== BUSCA DE CPF ====================

async function searchCpf() {
  const cpfInput = document.getElementById('cpf-input');
  const cpf = cpfInput.value.trim();
  const errorElement = document.getElementById('error-cpf');
  const btnSearch = document.getElementById('btn-search');
  const loadingElement = document.getElementById('loading-cpf');
  
  errorElement.textContent = '';
  
  if (cpf.length !== 4) {
    errorElement.textContent = 'Digite exatamente 4 dígitos';
    return;
  }
  
  btnSearch.disabled = true;
  loadingElement.style.display = 'flex';
  
  try {
    const data = await fetchGistData();
    const matches = data.filter(record => record.cpf_primeiros_4 === cpf);
    
    state.currentCpf = cpf;
    state.selectedName = null;
    
    if (matches.length === 0) {
      state.cpfExists = false;
      state.matchedUsers = [];
      showRandomNamesScreen();
    } else {
      state.cpfExists = true;
      state.matchedUsers = matches;
      showNameSelectionScreen();
    }
  } catch (error) {
    console.error('Erro ao buscar CPF:', error);
    errorElement.textContent = 'Erro ao conectar ao servidor. Tente novamente.';
    btnSearch.disabled = false;
    loadingElement.style.display = 'none';
  }
}

// ==================== BUSCA DE DADOS DO GIST ====================

async function fetchGistData() {
  try {
    const response = await fetch(GIST_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados do Gist:', error);
    throw error;
  }
}

// ==================== TELA DE SELEÇÃO DE NOME (CPF VÁLIDO) ====================

function showNameSelectionScreen() {
  const realNames = state.matchedUsers.map(u => u.primeiro_nome);
  const alternatives = buildAlternativesList(realNames);
  
  shuffleArray(alternatives);
  
  const container = document.getElementById('names-container');
  container.innerHTML = '';
  
  alternatives.forEach((name) => {
    const button = document.createElement('button');
    button.className = 'name-option';
    button.textContent = name;
    button.setAttribute('data-name', name);
    button.setAttribute('aria-label', `Opção: ${name}`);
    
    button.addEventListener('click', () => selectName(name, button));
    
    container.appendChild(button);
  });
  
  document.getElementById('error-name').textContent = '';
  document.getElementById('loading-cpf').style.display = 'none';
  document.getElementById('btn-search').disabled = false;
  showScreen('screen-name');
}

// ==================== TELA DE NOMES ALEATÓRIOS (CPF INVÁLIDO) ====================

function showRandomNamesScreen() {
  const randomNames = [];
  while (randomNames.length < 6) {
    const randomName = randomNamesList[Math.floor(Math.random() * randomNamesList.length)];
    
    if (!randomNames.includes(randomName)) {
      randomNames.push(randomName);
    }
  }
  
  shuffleArray(randomNames);
  
  const container = document.getElementById('names-container');
  container.innerHTML = '';
  
  randomNames.forEach((name) => {
    const button = document.createElement('button');
    button.className = 'name-option';
    button.textContent = name;
    button.setAttribute('data-name', name);
    button.setAttribute('aria-label', `Opção: ${name}`);
    
    button.addEventListener('click', () => selectName(name, button));
    
    container.appendChild(button);
  });
  
  document.getElementById('error-name').textContent = '';
  document.getElementById('loading-cpf').style.display = 'none';
  document.getElementById('btn-search').disabled = false;
  showScreen('screen-name');
}

// ==================== CONSTRUIR LISTA DE ALTERNATIVAS ====================

function buildAlternativesList(realNames) {
  const alternatives = [...realNames];
  
  const randomToAdd = [];
  while (randomToAdd.length < RANDOM_NAMES_COUNT) {
    const randomName = randomNamesList[Math.floor(Math.random() * randomNamesList.length)];
    
    if (!randomToAdd.includes(randomName) && !alternatives.includes(randomName)) {
      randomToAdd.push(randomName);
    }
  }
  
  alternatives.push(...randomToAdd);
  
  return [...new Set(alternatives)];
}

// ==================== SELEÇÃO DE NOME ====================

function selectName(name, buttonElement) {
  document.querySelectorAll('.name-option.selected').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  buttonElement.classList.add('selected');
  state.selectedName = name;
}

// ==================== CONFIRMAÇÃO DE NOME ====================

function confirmName() {
  if (!state.selectedName) {
    document.getElementById('error-name').textContent = 'Selecione um nome para continuar';
    return;
  }
  
  if (state.cpfExists) {
    const realNames = state.matchedUsers.map(u => u.primeiro_nome);
    
    if (realNames.includes(state.selectedName)) {
      const user = state.matchedUsers.find(u => u.primeiro_nome === state.selectedName);
      openBotpressEmbed(user.link_redirecionamento);
      return;
    }
  }
  
  showErrorScreen();
}

// ==================== ABRIR EMBED DO BOTPRESS ====================

function openBotpressEmbed(groupLink) {
  // Verificar se o link está mapeado nos embeds
  if (!BOTPRESS_EMBEDS[groupLink]) {
    console.error('Link não mapeado nos embeds:', groupLink);
    showErrorScreen();
    return;
  }
  
  const embedConfig = BOTPRESS_EMBEDS[groupLink];
  state.currentGroupKey = groupLink;
  
  // Limpar scripts Botpress anteriores
  document.querySelectorAll('script[data-embed="botpress"]').forEach(s => s.remove());
  
  // Limpar container anterior
  const container = document.getElementById(embedConfig.container_id);
  if (container) {
    container.innerHTML = '';
  }
  
  // Mostrar a tela de chat
  showScreen('screen-chat');
  
  // Injetar o script de inject primeiro
  const injectScript = document.createElement('script');
  injectScript.src = embedConfig.inject_script;
  injectScript.setAttribute('data-embed', 'botpress');
  injectScript.onload = () => {
    // Após injetar, carregar o config/bundle
    const configScript = document.createElement('script');
    configScript.src = embedConfig.config_script;
    configScript.defer = true;
    configScript.setAttribute('data-embed', 'botpress');
    configScript.onload = () => {
      // Aguardar um pouco para o Botpress inicializar
      setTimeout(() => {
        // Tentar usar a API do Botpress se disponível
        if (window.botpressWebChat) {
          window.botpressWebChat.sendEvent({ type: 'LIFECYCLE.LOADED' });
        }
      }, 500);
    };
    document.body.appendChild(configScript);
  };
  document.body.appendChild(injectScript);
}

// ==================== TELA DE ERRO ====================

function showErrorScreen() {
  const warningMessage = document.getElementById('warning-message');
  warningMessage.textContent = 'Atenção! Verifique seus dados. Múltiplas tentativas erradas podem resultar em bloqueio temporário.';
  
  showScreen('screen-error');
}

// ==================== BLOQUEIO DE ACESSO (BÁSICO) ====================

function checkIfLocked() {
  try {
    const lockEndTime = localStorage.getItem('auth_lock_end_time');
    if (lockEndTime) {
      const endTime = parseInt(lockEndTime);
      if (Date.now() < endTime) {
        state.isLocked = true;
        state.lockEndTime = endTime;
      }
    }
  } catch (e) {
    console.warn('localStorage não disponível');
  }
}

// ==================== NAVEGAÇÃO ====================

function backToCpf() {
  state.selectedName = null;
  state.matchedUsers = [];
  state.currentCpf = null;
  state.cpfExists = false;
  state.currentGroupKey = null;
  
  // Remover scripts do Botpress ao voltar
  document.querySelectorAll('script[data-embed="botpress"]').forEach(s => s.remove());
  
  const cpfInput = document.getElementById('cpf-input');
  const cpfBackground = document.querySelector('.cpf-background');
  
  cpfInput.value = '';
  cpfBackground.classList.remove('hidden');
  document.getElementById('error-cpf').textContent = '';
  document.getElementById('btn-search').disabled = false;
  document.getElementById('loading-cpf').style.display = 'none';
  
  showScreen('screen-cpf');
}

// ==================== UTILITÁRIOS ====================

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
