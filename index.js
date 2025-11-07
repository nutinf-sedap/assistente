// Função de debug para atualizar status na página
function updateDebugStatus(message, color = '#333') {
    const statusDiv = document.getElementById('debug-status');
    if (statusDiv) {
        statusDiv.innerHTML = `Status: ${message}`;
        statusDiv.style.color = color;
        console.log(`🔍 Debug: ${message}`);
    }
}

// Função para mostrar/ocultar loading
function toggleLoading(show) {
    let loading = document.getElementById('loading');
    if (!loading) {
        loading = document.createElement('div');
        loading.id = 'loading';
        loading.className = 'loading';
        loading.innerHTML = '<div>🔄 Carregando Chatbot...</div>';
        document.body.appendChild(loading);
    }
    loading.classList.toggle('hidden', !show);
}

// Gera ID único por dispositivo
function generateUniqueUserId() {
    let userId = localStorage.getItem('coze_user_id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('coze_user_id', userId);
        console.log('🆕 Novo usuário:', userId);
    }
    return userId;
}

document.addEventListener('DOMContentLoaded', () => {
    updateDebugStatus('Iniciando carregamento do SDK...', '#007bff');
    toggleLoading(true);
    
    const uniqueUserId = generateUniqueUserId();
    updateDebugStatus('ID de usuário gerado: ' + uniqueUserId.substring(0, 20) + '...', '#007bff');
    
    // CONFIGS - SUBSTITUA AQUI!
    const BOT_ID = '7569740873408806930'; // ← SEU BOT_ID REAL
    const TOKEN = 'pat_hcAUqeVd3kk8t8CuutNzfQKZu5b2duD1YogVbLCBScRSULNiIBTXpk8ozvntOQDk'; // ← SEU PAT REAL
    
    // Validação básica
    if (BOT_ID === '7569740873408806930' || TOKEN === 'pat_SEU_TOKEN_REAL_AQUI') {
        updateDebugStatus('❌ ERRO: Substitua BOT_ID e TOKEN no index.js!', '#ff0000');
        toggleLoading(false);
        alert('⚠️ CONFIGURAÇÃO INVÁLIDA!\n\nAbra index.js e substitua:\n- BOT_ID pelo ID real do seu bot\n- TOKEN pelo seu Personal Access Token real\n\nTutorial: My Profile > Access Tokens');
        return;
    }
    
    // Carrega o SDK com timeout e retry
    function loadCozeSDK(attempt = 1) {
        updateDebugStatus(`Carregando SDK (tentativa ${attempt})...`, '#ff9900');
        
        const script = document.createElement('script');
        script.src = 'https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/oversea/index.js';
        script.async = true;
        script.onload = () => {
            updateDebugStatus('✅ SDK carregado com sucesso!', '#28a745');
            initializeChat();
        };
        script.onerror = () => {
            updateDebugStatus('❌ Falha ao carregar SDK. Tentando URL alternativa...', '#ff0000');
            // Tenta versão mais recente se falhar
            if (attempt === 1) {
                script.src = 'https://unpkg.com/@coze/chat-sdk@latest/dist/index.umd.js';
                document.head.appendChild(script);
                loadCozeSDK(2);
            } else {
                updateDebugStatus('❌ SDK não pôde ser carregado. Verifique conexão.', '#ff0000');
                toggleLoading(false);
                alert('Falha no carregamento do SDK. Verifique sua internet ou tente em 5 minutos.');
            }
        };
        
        if (attempt === 1) {
            document.head.appendChild(script);
        }
    }
    
    // Inicializa o chat após SDK carregar
    function initializeChat() {
        updateDebugStatus('Inicializando chatbot...', '#007bff');
        
        try {
            // Verifica se o SDK está disponível
            if (typeof CozeWebSDK === 'undefined') {
                throw new Error('CozeWebSDK não encontrado. SDK pode não ter carregado completamente.');
            }
            
            const chatClient = new CozeWebSDK.WebChatClient({
                config: {
                    type: 'bot',
                    bot_id: BOT_ID,
                    debug: true // Ativa logs internos do SDK
                },
                
                auth: {
                    type: 'token',
                    token: TOKEN,
                    onRefreshToken: () => TOKEN
                },
                
                userInfo: {
                    id: uniqueUserId,
                    nickname: 'Visitante'
                },
                
                ui: {
                    base: {
                        lang: 'pt-BR',
                        zIndex: 999999
                    },
                    header: {
                        isShow: true,
                        isNeedClose: true
                    },
                    // CRUCIAL: Força o balão flutuante
                    asstBtn: {
                        isNeed: true, // DEVE ser true para mostrar o balão
                        position: 'right-bottom', // Canto inferior direito
                        offset: { x: 20, y: 20 } // 20px da borda
                    },
                    chatBot: {
                        title: 'Assistente IA',
                        welcomeMsg: 'Olá! Como posso ajudar?', // Mensagem inicial
                        uploadable: true
                    }
                },
                
                onInit: () => {
                    updateDebugStatus('🎉 Chatbot inicializado! Balão deve aparecer no canto.', '#28a745');
                    toggleLoading(false);
                    console.log('✅ Tudo funcionando! User ID:', uniqueUserId);
                },
                
                onError: (error) => {
                    console.error('❌ Erro no SDK:', error);
                    updateDebugStatus('❌ Erro: ' + (error.message || error), '#ff0000');
                    toggleLoading(false);
                    alert('Erro no chatbot: ' + (error.message || 'Desconhecido'));
                }
            });
            
            // Inicializa o widget (método padrão)
            updateDebugStatus('Chamando inicialização do widget...', '#007bff');
            chatClient.init(); // Ou apenas new() - testa ambos
            
        } catch (error) {
            console.error('🚨 Falha na inicialização:', error);
            updateDebugStatus('🚨 Falha: ' + error.message, '#ff0000');
            toggleLoading(false);
            alert('Falha crítica: ' + error.message);
        }
    }
    
    // Inicia o processo
    loadCozeSDK();
    
    // Timeout de segurança (5s)
    setTimeout(() => {
        if (document.querySelector('[class*="asstBtn"], [class*="floating"], .coze-widget')) {
            updateDebugStatus('👀 Widget detectado na página!', '#28a745');
        } else {
            updateDebugStatus('⚠️ Widget não detectado. Verifique console para erros.', '#ff9900');
        }
    }, 5000);
});
