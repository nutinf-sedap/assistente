// ... (mantenha as funções updateDebugStatus, toggleLoading, generateUniqueUserId iguais da versão anterior)

document.addEventListener('DOMContentLoaded', () => {
    updateDebugStatus('Iniciando...', '#007bff');
    toggleLoading(true);
    
    const uniqueUserId = generateUniqueUserId();
    const BOT_ID = '7569740873408806930'; // SUBSTITUA
    const TOKEN = 'pat_hcAUqeVd3kk8t8CuutNzfQKZu5b2duD1YogVbLCBScRSULNiIBTXpk8ozvntOQDk'; // NOVO TOKEN
    
    // Validação
    if (BOT_ID.includes('SUBSTITUA') || TOKEN.includes('SEU_TOKEN')) {
        updateDebugStatus('❌ Configure BOT_ID e TOKEN!', '#ff0000');
        toggleLoading(false);
        return;
    }
    
    function loadCozeSDK(attempt = 1) {
        updateDebugStatus(`Carregando SDK (v${attempt})...`, '#ff9900');
        
        const script = document.createElement('script');
        script.src = 'https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/oversea/index.js';
        script.async = true;
        
        script.onload = () => {
            updateDebugStatus('✅ SDK carregado', '#28a745');
            
            // Delay para SDK se inicializar completamente
            setTimeout(() => initializeChat(), 1000);
        };
        
        script.onerror = () => {
            updateDebugStatus('❌ SDK falhou. Usando CDN alternativa...', '#ff0000');
            if (attempt < 3) {
                script.src = 'https://unpkg.com/@coze/chat-sdk@0.1.11-beta.19/dist/index.umd.js';
                document.head.appendChild(script);
                loadCozeSDK(attempt + 1);
            } else {
                updateDebugStatus('❌ CDN indisponível', '#ff0000');
                toggleLoading(false);
            }
        };
        
        document.head.appendChild(script);
    }
    
    function initializeChat() {
        updateDebugStatus('Inicializando com retry handling...', '#007bff');
        
        try {
            if (typeof CozeWebSDK === 'undefined') {
                throw new Error('SDK não carregado');
            }
            
            const chatClient = new CozeWebSDK.WebChatClient({
                config: {
                    type: 'bot',
                    bot_id: BOT_ID,
                    debug: true, // Logs internos
                    retryCount: 3, // Máximo 3 retries antes de falhar
                    retryInterval: 2000 // 2s entre retries
                },
                
                auth: {
                    type: 'token',
                    token: TOKEN,
                    onRefreshToken: () => {
                        console.log('🔄 Token refresh chamado');
                        return TOKEN; // Use o mesmo ou implemente refresh real
                    }
                },
                
                userInfo: {
                    id: uniqueUserId.substring(0, 50), // Limita tamanho para evitar erros
                    nickname: 'Visitante'
                },
                
                ui: {
                    base: {
                        lang: 'pt-BR',
                        zIndex: 999999,
                        retryNotification: false // DESABILITA notificação de retry
                    },
                    header: { isShow: true, isNeedClose: true },
                    asstBtn: {
                        isNeed: true,
                        position: 'right-bottom',
                        offset: { x: 20, y: 100 }, // Mais visível
                        size: 'medium' // Tamanho médio do balão
                    },
                    chatBot: {
                        title: 'Assistente IA',
                        welcomeMsg: 'Olá! Estou aqui para ajudar.',
                        uploadable: false // Simplifica para testes
                    }
                },
                
                // Eventos para capturar e tratar retries
                onInit: () => {
                    updateDebugStatus('🎉 Widget inicializado!', '#28a745');
                    toggleLoading(false);
                    // Verifica se balão apareceu após 3s
                    setTimeout(() => {
                        if (!document.querySelector('[class*="asstBtn"]')) {
                            updateDebugStatus('⚠️ Balão não visível. Forçando refresh...', '#ff9900');
                            location.reload(); // Reload para tentar novamente
                        }
                    }, 3000);
                },
                
                onError: (error) => {
                    console.error('❌ SDK Error:', error);
                    if (error.code === 'web_sdk_retry_notification' || error.includes('retry')) {
                        updateDebugStatus('🔄 Retry detectado. Verifique publicação do bot.', '#ff9900');
                        // Não falha imediatamente - deixa o SDK tentar
                        setTimeout(initializeChat, 5000); // Re-tenta em 5s
                    } else {
                        updateDebugStatus('❌ Erro: ' + error.message, '#ff0000');
                        toggleLoading(false);
                    }
                },
                
                // Evento específico para retry notifications
                onRetry: (attempt) => {
                    console.log(`🔄 Retry ${attempt}: Conexão instável`);
                    updateDebugStatus(`🔄 Tentativa ${attempt}/3...`, '#ff9900');
                }
            });
            
            // Inicializa explicitamente
            chatClient.init?.() || console.log('✅ SDK pronto, balão deve aparecer');
            
        } catch (error) {
            console.error('🚨 Init falhou:', error);
            updateDebugStatus('🚨 Init Error: ' + error.message, '#ff0000');
            toggleLoading(false);
        }
    }
    
    loadCozeSDK();
});

// Monitora mudanças no DOM para detectar o widget
const observer = new MutationObserver(() => {
    if (document.querySelector('[class*="asstBtn"], [class*="coze"], [class*="chat-widget"]')) {
        updateDebugStatus('👀 Widget detectado no DOM!', '#28a745');
        observer.disconnect();
    }
});
observer.observe(document.body, { childList: true, subtree: true });
