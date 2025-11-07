document.addEventListener('DOMContentLoaded', () => {
  const loadingContainer = document.getElementById('loading-container');
  try {
    const chatClient = new CozeWebSDK.WebChatClient({
      config: {
        type: 'bot',
        bot_id: '7569740873408806930',
        isIframe: true,
        el: '#chat-root'  // Especifica onde montar
      },
      auth: {
        type: 'token',
        token: 'pat_hcAUqeVd3kk8t8CuutNzfQKZu5b2duD1YogVbLCBScRSULNiIBTXpk8ozvntOQDk',
        onRefreshToken: () => 'pat_hcAUqeVd3kk8t8CuutNzfQKZu5b2duD1YogVbLCBScRSULNiIBTXpk8ozvntOQDk'
      },
      ui: {
        header: { isShow: true, isNeedClose: false },
        asstBtn: { isNeed: false },
        chatBot: { title: 'Meu Assistente IA' }
      },
      onInit: () => {
        console.log('Chat SDK inicializado');
        loadingContainer?.classList.add('hidden');
      },
      onError: (error) => {
        console.error('Erro no chat:', error);
        document.getElementById('chat-root').innerHTML = `<div style="color:red;">Erro ao carregar chat: ${error.message}</div>`;
      }
    });
  } catch (error) {
    console.error('Erro crítico ao inicializar SDK:', error);
  }
});
