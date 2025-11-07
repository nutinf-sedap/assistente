// Espera o DOM estar totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

    const loadingContainer = document.getElementById('loading-container');

    try {
        // Inicializa o cliente do Coze Chat SDK
        new CozeWebSDK.WebChatClient({
            // Configuração principal do bot
            config: {
                bot_id: '7569740873408806930', // SUBSTITUA pelo seu bot_id
                isIframe: true // Mantém true para modo embutido/maximizado
            },
            
            // Configuração de autenticação
            auth: {
                type: 'token',
                token: 'pat_hcAUqeVd3kk8t8CuutNzfQKZu5b2duD1YogVbLCBScRSULNiIBTXpk8ozvntOQDk', // SUBSTITUA pelo seu PAT
                onRefreshToken: () => 'pat_hcAUqeVd3kk8t8CuutNzfQKZu5b2duD1YogVbLCBScRSULNiIBTXpk8ozvntOQDk'
            },

            // Configuração da aparência (UI)
            ui: {
                header: {
                    isShow: true,
                    isNeedClose: false
                },
                asstBtn: {
                    isNeed: false
                },
                chatBot: {
                    title: 'Meu Assistente IA',
                    // CRUCIAL: Apontamos o container aqui, não usamos .mount()
                    el: '#chat-root' 
                }
            },

            // Funções de callback para eventos
            onInit: () => {
                console.log('Chatbot inicializado com sucesso!');
                if (loadingContainer) {
                    loadingContainer.classList.add('hidden');
                }
            },
            onError: (error) => {
                console.error('Erro no chatbot:', error);
                const chatRoot = document.getElementById('chat-root');
                chatRoot.innerHTML = `<div style="text-align: center; color: red;"><h3>Erro ao carregar o assistente</h3><p>${error.message}</p></div>`;
            }
        });

    } catch (error) {
        console.error('Falha crítica ao inicializar o SDK:', error);
        const chatRoot = document.getElementById('chat-root');
        chatRoot.innerHTML = '<div style="text-align: center; color: red;"><h3>Erro Crítico</h3><p>Não foi possível carregar o script do chatbot.</p></div>';
    }
});
