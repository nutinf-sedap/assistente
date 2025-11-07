// Função para gerar ID único por dispositivo (armazenado localmente)
function generateUniqueUserId() {
    let userId = localStorage.getItem('coze_user_id');
    
    if (!userId) {
        // ID único: timestamp + random + navegador fingerprint simples
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + 
                 '_' + navigator.userAgent.slice(0, 10).replace(/\s/g, '');
        localStorage.setItem('coze_user_id', userId);
        console.log('🆕 Novo usuário criado:', userId);
    }
    
    return userId;
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

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // Gera ID único para este usuário/dispositivo
    const uniqueUserId = generateUniqueUserId();
    
    // Mostra loading
    toggleLoading(true);
    
    // Carrega o SDK do Coze dinamicamente (mais confiável)
    const script = document.createElement('script');
    script.src = 'https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/oversea/index.js';
    script.onload = () => {
        try {
            // Inicializa o Chat SDK com configurações simples
            new CozeWebSDK.WebChatClient({
                // Config básica do bot (balão flutuante padrão)
                config: {
                    type: 'bot',
                    bot_id: '7569740873408806930' // SUBSTITUA pelo seu bot_id real
                },
                
                // Autenticação (use seu PAT real)
                auth: {
                    type: 'token',
                    token: 'pat_SEU_TOKEN_REAL_AQUI', // SUBSTITUA pelo seu PAT
                    onRefreshToken: () => 'pat_SEU_TOKEN_REAL_AQUI' // Mesmo token ou novo
                },
                
                // CRUCIAL: Identificação única por usuário/dispositivo
                userInfo: {
                    id: uniqueUserId, // Garante sessão isolada por dispositivo
                    nickname: 'Visitante', // Nome genérico
                    // Avatar opcional (pode remover se não quiser)
                    // url: 'https://sf-coze-web-cdn.coze.com/obj/eden-sg/lm-lgvj/ljhwZthlaukjlkulzlp/coze/coze-logo.png'
                },
                
                // UI: Balão flutuante simples (padrão)
                ui: {
                    base: {
                        lang: 'pt-BR', // Ou 'en'
                        zIndex: 9999 // Acima de tudo na página
                    },
                    header: {
                        isShow: true, // Mostra título no chat aberto
                        isNeedClose: true // Botão para fechar o chat
                    },
                    asstBtn: {
                        isNeed: true // MOSTRA o balão flutuante no canto (padrão)
                    },
                    chatBot: {
                        title: 'Assistente IA', // Título do chat
                        uploadable: true // Permite upload de arquivos
                    }
                },
                
                // Callbacks para debug e loading
                onInit: () => {
                    console.log('✅ Chatbot carregado para usuário:', uniqueUserId);
                    toggleLoading(false); // Esconde loading
                },
                
                onError: (error) => {
                    console.error('❌ Erro no chatbot:', error);
                    toggleLoading(false);
                    alert('Erro ao carregar o chatbot. Verifique o console (F12).');
                }
            });
            
            console.log('🚀 SDK inicializado. Balão flutuante pronto!');
            
        } catch (error) {
            console.error('🚨 Falha na inicialização:', error);
            toggleLoading(false);
            alert('Falha crítica. Verifique se o bot_id e token estão corretos.');
        }
    };
    
    script.onerror = () => {
        console.error('🚨 Falha ao carregar o SDK do Coze');
        toggleLoading(false);
        alert('Não foi possível carregar o chatbot. Verifique sua conexão.');
    };
    
    document.head.appendChild(script);
});
