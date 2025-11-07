// Função para gerar ID único e persistente para cada usuário/dispositivo
function generateUniqueUserId() {
    // Tenta recuperar ID existente do localStorage (persiste no mesmo dispositivo/navegador)
    let userId = localStorage.getItem('coze_user_id');
    
    if (!userId) {
        // Gera um novo ID único: timestamp + random string
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('coze_user_id', userId);
        console.log('🆕 Novo usuário criado com ID:', userId);
    } else {
        console.log('👤 Usuário existente detectado com ID:', userId);
    }
    
    return userId;
}

// Função para gerar um nickname amigável baseado no ID
function generateUserNickname(userId) {
    // Extrai os últimos 6 caracteres do ID para criar um nome curto
    return 'Visitante ' + userId.substring(userId.length - 6).toUpperCase();
}

// Inicializa o chatbot quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Gera ID único para este usuário/dispositivo
    const uniqueUserId = generateUniqueUserId();
    const userNickname = generateUserNickname(uniqueUserId);
    
    console.log('🚀 Inicializando chatbot para:', userNickname, '(ID:', uniqueUserId, ')');
    
    try {
        // Cria o cliente do Coze Chat SDK com configurações minimalistas
        new CozeWebSDK.WebChatClient({
            // Configurações básicas do bot
            config: {
                type: 'bot',
                bot_id: '7569740873408806930'  // SUBSTITUA pelo SEU bot_id
            },
            
            // Autenticação com PAT
            auth: {
                type: 'token',
                token: 'pat_hcAUqeVd3kk8t8CuutNzfQKZu5b2duD1YogVbLCBScRSULNiIBTXpk8ozvntOQDk',  // SUBSTITUA pelo SEU PAT
                onRefreshToken: function() {
                    return 'pat_hcAUqeVd3kk8t8CuutNzfQKZu5b2duD1YogVbLCBScRSULNiIBTXpk8ozvntOQDk';  // Retorna o mesmo token
                }
            },
            
            // CRUCIAL: Identificação única do usuário para sessões isoladas
            userInfo: {
                id: uniqueUserId,  // ID único por dispositivo/navegador
                nickname: userNickname,  // Nome amigável
                // Avatar opcional (deixe vazio se não quiser)
                // avatar: 'https://exemplo.com/avatar.png'
            },
            
            // Configurações da interface (UI) - Balão flutuante padrão
            ui: {
                // Cabeçalho do chat
                header: {
                    isShow: true,  // Mostra o título
                    isNeedClose: true  // Permite fechar o chat
                },
                
                // Botão flutuante (BALÃO NO CANTO)
                asstBtn: {
                    isNeed: true  // true = mostra o balão flutuante no canto
                },
                
                // Configurações do chatbox
                chatBot: {
                    title: 'Assistente IA',  // Título que aparece no cabeçalho
                    uploadable: true  // Permite upload de arquivos (se o bot suportar)
                },
                               
                // Idioma e outros
                base: {
                    lang: 'pt-BR',  // Tenta português, fallback para en
                    zIndex: 9999  // Garante que o balão fique acima de tudo
                }
            },
            
            // Callbacks para debug e eventos
            onInit: function() {
                console.log('✅ Chatbot inicializado com sucesso!');
                console.log('📱 Sessão isolada criada para este dispositivo');
            },
            
            onError: function(error) {
                console.error('❌ Erro no chatbot:', error);
                // Opcional: mostrar alerta para o usuário
                if (error.message.includes('token')) {
                    alert('Erro de autenticação. Verifique se o token está correto.');
                } else if (error.message.includes('bot_id')) {
                    alert('Bot não encontrado. Verifique o bot_id.');
                }
            },
            
            onThemeChange: function(type) {
                console.log('🎨 Tema alterado para:', type);
            }
        });
        
        console.log('📡 SDK do Coze carregado e configurado');
        
    } catch (error) {
        console.error('🚨 Erro crítico ao inicializar chatbot:', error);
        document.body.innerHTML += '<div style="color:red; padding:20px; text-align:center;"><h2>❌ Erro ao carregar chatbot</h2><p>Verifique o console (F12) para detalhes.</p></div>';
    }
});
