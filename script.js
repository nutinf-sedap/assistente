// ==================== CONFIGURAÇÃO ====================
const GIST_URL = 'https://gist.githubusercontent.com/YOUR_USERNAME/YOUR_GIST_ID/raw/'; // Substitua pelos seus valores
const RANDOM_NAMES_COUNT = 4;
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 10 * 60 * 1000; // 10 minutos em ms

// ==================== ESTADO GLOBAL ====================
let state = {
    currentCpf: null,
    matchedUsers: [],
    selectedName: null,
    attemptCount: 0,
    isLocked: false,
    lockEndTime: null
};

// Lista de nomes aleatórios (será importada dinamicamente ou hardcoded)
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
        // Você pode hospedar esta lista em um arquivo separado ou em um Gist
        // Para simplicidade, usamos uma lista padrão aqui
        randomNamesList = getDefaultRandomNamesList();
    } catch (error) {
        console.error('Erro ao carregar lista de nomes:', error);
        randomNamesList = getDefaultRandomNamesList();
    }
}

function getDefaultRandomNamesList() {
    // Lista com centenas de nomes masculinos e femininos variados
    return [
        // Masculinos
        'Roberto', 'Carlos', 'Francisco', 'Antonio', 'Marcos', 'Alexandre', 'Felipe', 'Diego',
        'Bruno', 'Ricardo', 'Rodrigo', 'Gustavo', 'Lucas', 'Daniel', 'Rafael', 'Fernando',
        'Sergio', 'Paulo', 'Luis', 'Fabio', 'Claudio', 'Marcelo', 'Mateus', 'Andre',
        'Edson', 'Leandro', 'Thiago', 'Mauricio', 'Gabriel', 'Henrique', 'Leonardo', 'Samuel',
        'Gilson', 'Denis', 'Otavio', 'Vinicius', 'Joao', 'Jose', 'Manuel', 'Vicente',
        'Inacio', 'Anastacio', 'Anibal', 'Anselmo', 'Apolonio', 'Ariosto', 'Armando', 'Arnaldo',
        'Arsênio', 'Artemio', 'Augusto', 'Aurelio', 'Aureliano', 'Ausonio', 'Avelino', 'Avery',
        'Ayrton', 'Azarias', 'Baltasar', 'Baltazar', 'Banilson', 'Belmiro', 'Beltrão', 'Benedito',
        'Benilson', 'Beno', 'Benoit', 'Benoni', 'Benvenuto', 'Berevino', 'Berfino', 'Berilo',
        'Brinaldo', 'Brás', 'Braulio', 'Braz', 'Breno', 'Brás', 'Brito', 'Brittão',
        'Brás', 'Buenaventura', 'Caetano', 'Caetão', 'Caiçara', 'Caio', 'Cais', 'Caison',
        'Cajetano', 'Calamaco', 'Calcídio', 'Calcídeo', 'Caldas', 'Caldeira', 'Calderão', 'Calderino',
        'Calderôes', 'Caldez', 'Calderizo', 'Caldezio', 'Calfucão', 'Caligula', 'Calimaco', 'Calinada',
        'Calístenes', 'Calisto', 'Califoro', 'Calobrino', 'Calofrino', 'Calomino', 'Calomiro', 'Calomizo',
        'Calonio', 'Calonizio', 'Calorino', 'Calorizio', 'Calorizo', 'Calotipo', 'Calovano', 'Calozário',
        'Calozaro', 'Calozairo', 'Calusto', 'Calusão', 'Calusário', 'Calusarro', 'Calusiro', 'Calusizu',
        'Calusto', 'Caluto', 'Calvacande', 'Calvacante', 'Calvacanti', 'Calvacantio', 'Calvacanto', 'Calvacin',
        'Calvácio', 'Calvácti', 'Calvada', 'Calvadore', 'Calvadori', 'Calvadoro', 'Calvadoso', 'Calvadouro',
        'Calvaduz', 'Calvaço', 'Calvahano', 'Calvajano', 'Calvajau', 'Calvajeiro', 'Calvajildo', 'Calvajildo',
        'Calvajilho', 'Calvajuche', 'Calvajudo', 'Calvala', 'Calvalada', 'Calvaladelo', 'Calvaladera', 'Cavaladerim',
        'Cavaladezia', 'Cavaladeza', 'Cavaladezo', 'Cavaladi', 'Cavaladiana', 'Cavaladiano', 'Cavaladiao', 'Cavaladina',
        'Cavaladino', 'Cavaladio', 'Cavaladoel', 'Cavaladoga', 'Cavaladote', 'Cavalador', 'Cavaladora', 'Cavaladoraia',
        // Femininos
        'Ana', 'Beatriz', 'Carla', 'Daniela', 'Elisa', 'Fernanda', 'Gabriela', 'Heloisa',
        'Iris', 'Joana', 'Katarina', 'Laura', 'Mariana', 'Natalia', 'Olivia', 'Patricia',
        'Quinete', 'Rafaela', 'Simone', 'Tatiana', 'Ursula', 'Vanessa', 'Wanda', 'Ximena',
        'Yasmin', 'Zelia', 'Abigail', 'Adriana', 'Agatha', 'Agostinha', 'Aida', 'Aileen',
        'Aileyana', 'Aileyne', 'Ailsa', 'Aima', 'Aimara', 'Aimarinha', 'Aina', 'Ainara',
        'Ainarja', 'Ainayne', 'Aindreia', 'Aindria', 'Aineah', 'Aineide', 'Aineide', 'Aineire',
        'Aineire', 'Ainelice', 'Ainelia', 'Ainelice', 'Ainelis', 'Aineliz', 'Ainelyda', 'Ainelzira',
        'Ainema', 'Ainemara', 'Ainemaracileira', 'Ainemilena', 'Ainemir', 'Ainemira', 'Ainena', 'Ainenara',
        'Ainenilda', 'Ainenilda', 'Ainenilda', 'Ainenice', 'Ainenice', 'Ainenicilda', 'Ainenida', 'Ainenilda',
        'Ainenilda', 'Ainenildo', 'Ainenildo', 'Ainenilda', 'Ainenilda', 'Ainenilda', 'Ainenildo', 'Ainenilda',
        'Aimene', 'Aimenia', 'Aimenia', 'Aimenica', 'Aimenicada', 'Aimenaida', 'Aimenaides', 'Aimenarda',
        'Aimenblanda', 'Aimenberta', 'Aimenblanca', 'Aimenblanca', 'Aimenblanca', 'Aimenblanca', 'Aimenblanca', 'Aimenblanca',
        'Aimencada', 'Aimencara', 'Aimencarina', 'Aimencasa', 'Aimencatarina', 'Aimencatarina', 'Aimencatarina', 'Aimencatarina',
        'Aimencecilia', 'Aimencelia', 'Aimencendalia', 'Aimencendalia', 'Aimencenda', 'Aimencenda', 'Aimencenda', 'Aimencenda',
        'Aimencenilda', 'Aimencenilda', 'Aimencenilda', 'Aimencenicileia', 'Aimencenicileia', 'Aimencenicilia', 'Aimencenicilia', 'Aimencenicilia',
        'Aimencenice', 'Aimencenice', 'Aimencenice', 'Aimenceniceia', 'Aimenceniceia', 'Aimenceniceia', 'Aimenceniceia', 'Aimenceniceia'
    ];
}

// ==================== CONFIGURAÇÃO DE EVENTOS ====================
function setupEventListeners() {
    // Tela de CPF
    const cpfInput = document.getElementById('cpf-input');
    const btnSearch = document.getElementById('btn-search');
    
    cpfInput.addEventListener('input', (e) => {
        // Permitir apenas números
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        document.getElementById('error-cpf').textContent = '';
    });
    
    cpfInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && cpfInput.value.length === 4) {
            searchCpf();
        }
    });
    
    btnSearch.addEventListener('click', searchCpf);
    
    // Tela de Seleção de Nome
    document.getElementById('btn-confirm-name').addEventListener('click', confirmName);
    document.getElementById('btn-back-to-cpf').addEventListener('click', backToCpf);
    
    // Tela de Erro e Sucesso
    document.getElementById('btn-retry').addEventListener('click', backToCpf);
    document.getElementById('btn-access').addEventListener('click', redirectToLink);
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
    
    // Verificar se está bloqueado
    if (state.isLocked) {
        const remainingTime = Math.ceil((state.lockEndTime - Date.now()) / 1000);
        errorElement.textContent = `Bloqueado. Tente novamente em ${remainingTime}s`;
        return;
    }
    
    btnSearch.disabled = true;
    loadingElement.style.display = 'flex';
    
    try {
        const data = await fetchGistData();
        const matches = data.filter(record => record.cpf_primeiros_4 === cpf);
        
        if (matches.length === 0) {
            errorElement.textContent = 'Nenhum registro encontrado com este prefixo';
            btnSearch.disabled = false;
            loadingElement.style.display = 'none';
            return;
        }
        
        state.currentCpf = cpf;
        state.matchedUsers = matches;
        state.selectedName = null;
        state.attemptCount = 0;
        
        showNameSelectionScreen();
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

// ==================== TELA DE SELEÇÃO DE NOME ====================
function showNameSelectionScreen() {
    const realNames = state.matchedUsers.map(u => u.primeiro_nome);
    const alternatives = buildAlternativesList(realNames);
    
    // Embaralhar
    shuffleArray(alternatives);
    
    // Renderizar opções
    const container = document.getElementById('names-container');
    container.innerHTML = '';
    
    alternatives.forEach((name, index) => {
        const button = document.createElement('button');
        button.className = 'name-option';
        button.textContent = name;
        button.setAttribute('data-name', name);
        button.setAttribute('aria-label', `Opção: ${name}`);
        
        button.addEventListener('click', () => selectName(name, button));
        
        container.appendChild(button);
    });
    
    document.getElementById('error-name').textContent = '';
    showScreen('screen-name');
}

// ==================== CONSTRUIR LISTA DE ALTERNATIVAS ====================
function buildAlternativesList(realNames) {
    const alternatives = [...realNames];
    
    // Adicionar nomes aleatórios sem repetição
    const randomToAdd = [];
    while (randomToAdd.length < RANDOM_NAMES_COUNT) {
        const randomName = randomNamesList[Math.floor(Math.random() * randomNamesList.length)];
        
        // Verificar se não está repetido e não está nos nomes reais
        if (!randomToAdd.includes(randomName) && !alternatives.includes(randomName)) {
            randomToAdd.push(randomName);
        }
    }
    
    alternatives.push(...randomToAdd);
    
    // Remover duplicatas (paranoia)
    return [...new Set(alternatives)];
}

// ==================== SELEÇÃO DE NOME ====================
function selectName(name, buttonElement) {
    // Desmarcar seleção anterior
    document.querySelectorAll('.name-option.selected').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Marcar nova seleção
    buttonElement.classList.add('selected');
    state.selectedName = name;
}

// ==================== CONFIRMAÇÃO DE NOME ====================
function confirmName() {
    if (!state.selectedName) {
        document.getElementById('error-name').textContent = 'Selecione um nome para continuar';
        return;
    }
    
    const realNames = state.matchedUsers.map(u => u.primeiro_nome);
    
    if (realNames.includes(state.selectedName)) {
        // Nome correto - redirecionar
        const user = state.matchedUsers.find(u => u.primeiro_nome === state.selectedName);
        showSuccessScreen(user.link_redirecionamento);
    } else {
        // Nome incorreto
        state.attemptCount++;
        
        if (state.attemptCount >= MAX_ATTEMPTS) {
            lockAccess();
            showLockScreen();
        } else {
            showErrorScreen();
        }
    }
}

// ==================== TELA DE SUCESSO ====================
function showSuccessScreen(redirectUrl) {
    const btnAccess = document.getElementById('btn-access');
    const loadingRedirect = document.getElementById('loading-redirect');
    
    document.getElementById('success-message').textContent = 'Acesso concedido com sucesso!';
    btnAccess.style.display = 'inline-block';
    loadingRedirect.style.display = 'none';
    
    // Armazenar URL para redirecionamento
    state.redirectUrl = redirectUrl;
    
    showScreen('screen-success');
}

// ==================== TELA DE ERRO ====================
function showErrorScreen() {
    const remainingAttempts = MAX_ATTEMPTS - state.attemptCount;
    const attemptInfo = document.getElementById('attempt-info');
    
    if (remainingAttempts > 0) {
        attemptInfo.textContent = `Tentativas restantes: ${remainingAttempts}`;
    }
    
    showScreen('screen-error');
}

// ==================== TELA DE BLOQUEIO ====================
function showLockScreen() {
    const attemptInfo = document.getElementById('attempt-info');
    attemptInfo.textContent = 'Você excedeu o número máximo de tentativas. Tente novamente em 10 minutos.';
    
    showScreen('screen-error');
    
    // Desabilitar botão por 10 minutos
    const btnRetry = document.getElementById('btn-retry');
    btnRetry.disabled = true;
    
    let remainingSeconds = 600;
    const countdownInterval = setInterval(() => {
        remainingSeconds--;
        attemptInfo.textContent = `Bloqueado. Desbloqueio em ${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, '0')}`;
        
        if (remainingSeconds <= 0) {
            clearInterval(countdownInterval);
            btnRetry.disabled = false;
            state.isLocked = false;
            unlockAccess();
        }
    }, 1000);
}

// ==================== BLOQUEIO DE ACESSO ====================
function lockAccess() {
    state.isLocked = true;
    state.lockEndTime = Date.now() + LOCK_TIME;
    
    // Salvar no localStorage para persistência entre abas/sessões
    try {
        localStorage.setItem('auth_lock_end_time', state.lockEndTime.toString());
    } catch (e) {
        console.warn('localStorage não disponível');
    }
}

function unlockAccess() {
    state.isLocked = false;
    state.lockEndTime = null;
    
    try {
        localStorage.removeItem('auth_lock_end_time');
    } catch (e) {
        console.warn('localStorage não disponível');
    }
}

function checkIfLocked() {
    try {
        const lockEndTime = localStorage.getItem('auth_lock_end_time');
        if (lockEndTime) {
            const endTime = parseInt(lockEndTime);
            if (Date.now() < endTime) {
                state.isLocked = true;
                state.lockEndTime = endTime;
            } else {
                unlockAccess();
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
    
    document.getElementById('cpf-input').value = '';
    document.getElementById('error-cpf').textContent = '';
    document.getElementById('btn-search').disabled = false;
    document.getElementById('loading-cpf').style.display = 'none';
    
    showScreen('screen-cpf');
}

// ==================== REDIRECIONAMENTO ====================
function redirectToLink() {
    if (state.redirectUrl) {
        window.location.href = state.redirectUrl;
    }
}

// ==================== UTILITÁRIOS ====================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}