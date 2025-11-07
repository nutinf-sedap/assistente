// Espera o DOM estar totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

    const chatRoot = document.getElementById('chat-root');
    const loadingContainer = document.getElementById('loading-container');

    try {
        // Inicializa o cliente do Coze Chat SDK
        const chatClient = new CozeWebSDK.WebChatClient({
            // Configuração principal do bot
            config: {
                type: 'bot',
                bot_id: '7569740873408806930', // SUBSTITUA pelo seu bot_id
                isIframe: true // CRUCIAL: true para modo embutido/maximizado
            },
            
            // Configuração de autenticação
            auth: {
                type: 'token',
                token: 'pat_hcAUqeVd3kk8t8CuutNzfQKZu5b2duD1YogVbLCBScRSULNiIBTXpk8ozvntOQDk', // SUBSTITUA pelo seu PAT
                onRefreshToken: () => 'pat_hcAUqeVd3kk8t8CuutNzfQKZu5b2duD1YogVbLCBScRSULNiIBTXpk8ozvntOQDk' // Retorne o mesmo token ou um novo
            },

            // Configuração da aparência (UI)
            ui: {
                header: {
                    isShow: true, // Mostra o cabeçalho
                    isNeedClose: false // Esconde o botão de fechar
                },
                asstBtn: {
                    isNeed: false // CRUCIAL: false para não mostrar o botão flutuante
                },
                chatBot: {
                    title: 'Meu Assistente IA' // Título no cabeçalho do chat
                }
            },

            // Funções de callback para eventos
            onInit: () => {
                console.log('Chatbot inicializado com sucesso!');
                // Esconde a mensagem de loading
                if (loadingContainer) {
                    loadingContainer.classList.add('hidden');
                }
            },
            onError: (error) => {
                console.error('Erro no chatbot:', error);
                // Exibe uma mensagem de erro para o usuário
                chatRoot.innerHTML = `<div style="text-align: center; color: red;"><h3>Erro ao carregar o assistente</h3><p>${error.message}</p></div>`;
            }
        });

        // Monta o chatbot no container definido no HTML
        chatClient.mount(chatRoot);

    } catch (error) {
        console.error('Falha crítica ao inicializar o SDK:', error);
        chatRoot.innerHTML = '<div style="text-align: center; color: red;"><h3>Erro Crítico</h3><p>Não foi possível carregar o script do chatbot.</p></div>';
    }
});
