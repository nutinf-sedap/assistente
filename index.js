// Gera um ID único para o usuário (garante sessões diferentes por dispositivo)
function createUserId() {
    let id = localStorage.getItem('coze_user');
    if (!id) {
        id = 'u' + Date.now() + Math.random().toString(36).slice(2, 8);
        localStorage.setItem('coze_user', id);
    }
    return id;
}

// Inicializa o chatbot quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    
    // CONFIGURAÇÕES - SUBSTITUA AQUI COM SEUS DADOS REAIS
    const BOT_ID = '7569740873408806930';  // Ex: '1234567890123456789'
    const TOKEN = 'pat_hcAUqeVd3kk8t8CuutNzfQKZu5b2duD1YogVbLCBScRSULNiIBTXpk8ozvntOQDk'; // Ex: 'pat_eyJhbGciOiJIUzI1Ni...'
    
    // VERIFICA SE AS CONFIGS ESTÃO CORRETAS
    if (BOT_ID === 'SEU_BOT_ID_AQUI' || TOKEN === 'pat_SEU_TOKEN_AQUI') {
        document.body.innerHTML += '<div style="color:red; text-align:center; padding:20px;">❌ CONFIGURAÇÃO INVÁLIDA!<br>Abra index.js e substitua BOT_ID e TOKEN pelos seus valores reais.</div>';
        return;
    }
    
    // ID único para sessões isoladas
    const userId = createUserId();
    
    // Carrega o SDK do Coze
    const sdkScript = document.createElement('script');
    sdkScript.src = 'https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/oversea/index.js';
    sdkScript.onload = function() {
        // Verifica se o SDK carregou
        if (typeof CozeWebSDK === 'undefined') {
            document.body.innerHTML += '<div style="color:red; text-align:center; padding:20px;">❌ Erro: SDK não carregou. Verifique internet.</div>';
            return;
        }
        
        try {
            // CRIA O CHATBOT COM CONFIGURAÇÃO MÍNIMA
            new CozeWebSDK.WebChatClient({
                
                // CONFIG DO BOT (essencial)
                config: {
                    bot_id: BOT_ID,  // Seu bot ID
                    type: 'bot'
                },
                
                // AUTENTICAÇÃO (essencial)
                auth: {
                    type: 'token',
                    token: TOKEN     // Seu token PAT
                },
                
                // USUÁRIO (para sessões isoladas)
                userInfo: {
                    id: userId,      // ID único por dispositivo
                    name: 'Usuário'
                },
                
                // INTERFACE (balão flutuante)
                ui: {
                    // Configurações básicas
                    base: {
                        lang: 'pt-BR',  // Idioma
                        zIndex: 9999    // Acima de tudo
                    },
                    
                    // Cabeçalho do chat
                    header: {
                        isShow: true,     // Mostra título
                        isNeedClose: true // Botão fechar
                    },
                    
                    // BALÃO FLUTUANTE (essencial)
                    asstBtn: {
                        isNeed: true,        // MOSTRA o balão
                        position: 'right-bottom', // Canto inferior direito
                        offset: { x: 20, y: 20 }  // Distância da borda
                    },
                    
                    // Config do chat
                    chatBot: {
                        title: 'Assistente IA',     // Título da janela
                        welcomeMsg: 'Olá! Como posso ajudar?' // Mensagem inicial
                    }
                },
                
                // CALLBACKS (feedback básico)
                onInit: function() {
                    console.log('✅ Chatbot carregado! Balão no canto.');
                },
                
                onError: function(error) {
                    console.error('❌ Erro:', error);
                    if (error.message) {
                        alert('Erro: ' + error.message);
                    }
                }
                
            }); // Fim do new CozeWebSDK
            
        } catch (error) {
            console.error('❌ Falha na inicialização:', error);
            document.body.innerHTML += '<div style="color:red; text-align:center; padding:20px;">❌ Erro ao inicializar: ' + error.message + '</div>';
        }
    };
    
    sdkScript.onerror = function() {
        document.body.innerHTML += '<div style="color:red; text-align:center; padding:20px;">❌ Falha ao carregar o SDK. Verifique conexão.</div>';
    };
    
    // Adiciona o script ao documento
    document.head.appendChild(sdkScript);
    
});
